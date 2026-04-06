export namespace NEXTJS {
  export interface PageProps {
    params: Promise<Record<string, string>>;
    children?: any;
  }
}
