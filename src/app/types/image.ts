export interface ImagesList {
  objects: Array<ImageObject>;
  base_url: string;
  continuation_token: string | null;
}

export interface ImageObject {
  key: string;
  last_modified: string;
  //  Size in bytes of the object.
  size: number;
}
