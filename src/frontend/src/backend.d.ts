import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface backendInterface {
    configureDomain(pDomain: string): Promise<void>;
    getDomain(): Promise<string | null>;
    getSubdomain(): Promise<string | null>;
    isPublished(): Promise<boolean>;
    publish(pSubdomain: string): Promise<void>;
    resetSiteStorage(): Promise<void>;
    unpublish(): Promise<void>;
}
