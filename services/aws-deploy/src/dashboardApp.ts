import * as cdk from 'aws-cdk-lib';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3Deploy from 'aws-cdk-lib/aws-s3-deployment';

const appName = 'DashboardApp';
const appPath = '../../applications/dashboard/out';

export class DashboardApp extends cdk.Stack {
  constructor(scope: cdk.App, props?: cdk.StackProps) {
    super(scope, `${appName}Stack`, props);

    // Create S3 bucket for Next.js static export
    const websiteBucket = new s3.Bucket(this, `${appName}WebsiteBucket`, {
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      cors: [
        {
          allowedMethods: [s3.HttpMethods.GET, s3.HttpMethods.HEAD],
          allowedOrigins: ['*'],
          allowedHeaders: ['*'],
        },
      ],
    });

    // Create Origin Access Identity for CloudFront
    const originAccessIdentity = new cloudfront.OriginAccessIdentity(this, `${appName}OAI`, {
      comment: `OAI for ${appName} Next.js App`,
    });

    // Grant read permissions to CloudFront OAI
    websiteBucket.grantRead(originAccessIdentity);

    // Create CloudFront Function for URL rewriting (Next.js routing)
    const rewriteFunction = new cloudfront.Function(this, `${appName}RewriteFunction`, {
      code: cloudfront.FunctionCode.fromInline(`
          function handler(event) {
              var request = event.request;
              var uri = request.uri;
              
              // Check if the URI is missing a file extension
              if (!uri.includes('.')) {
                  // Check if URI ends with '/'
                  if (uri.endsWith('/')) {
                      request.uri = uri + 'index.html';
                  } else {
                      request.uri = uri + '.html';
                  }
              }
              
              return request;
          }
        `),
      comment: `URL rewrite for Next.js static export`,
    });

    // Create CloudFront Distribution
    const distribution = new cloudfront.Distribution(this, `${appName}Distribution`, {
      defaultBehavior: {
        origin: new origins.S3Origin(websiteBucket, {
          originAccessIdentity: originAccessIdentity,
        }),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD_OPTIONS,
        compress: true,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        functionAssociations: [
          {
            function: rewriteFunction,
            eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
          },
        ],
      },
      defaultRootObject: 'index.html',
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: cdk.Duration.minutes(5),
        },
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: cdk.Duration.minutes(5),
        },
      ],
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
      comment: `${appName} Next.js Application`,
    });

    // Deploy Next.js build output to S3
    new s3Deploy.BucketDeployment(this, `${appName}Deploy`, {
      sources: [s3Deploy.Source.asset(appPath)],
      destinationBucket: websiteBucket,
      distribution: distribution,
      distributionPaths: ['/*'],
      memoryLimit: 512,
      prune: true,
    });

    // Output the CloudFront URL
    new cdk.CfnOutput(this, `${appName}DistributionDomainName`, {
      value: distribution.distributionDomainName,
      description: 'CloudFront Distribution Domain Name',
      exportName: `${appName}DomainName`,
    });

    new cdk.CfnOutput(this, `${appName}DistributionURL`, {
      value: `https://${distribution.distributionDomainName}`,
      description: 'CloudFront Distribution URL',
      exportName: `${appName}URL`,
    });

    new cdk.CfnOutput(this, `${appName}BucketName`, {
      value: websiteBucket.bucketName,
      description: 'S3 Bucket Name',
      exportName: `${appName}BucketName`,
    });
  }
}
