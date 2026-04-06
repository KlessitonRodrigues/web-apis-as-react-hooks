import * as cdk from 'aws-cdk-lib';

import { AuthenticationApp } from './src/authenticationApp';
import { DashboardApp } from './src/dashboardApp';

const app = new cdk.App();

// Deploy Authentication App
new AuthenticationApp(app);

// Deploy Dashboard App
new DashboardApp(app);
