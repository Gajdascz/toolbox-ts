export interface Data<T extends string> {
  body: string;
  spdx: T;
  title: string;
  url: string;
}
