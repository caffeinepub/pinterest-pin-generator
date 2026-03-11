import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export type Title = string;
export interface TimeRecommendation {
    region: string;
    time: string;
    typeOfDay: string;
}
export interface PinterestPinContent {
    titles: Array<Title>;
    hashtags: Array<Array<Hashtag>>;
    originalUrl: string;
    timeRecommendations: Array<TimeRecommendation>;
    descriptions: Array<Description>;
    imagePrompts: Array<ImagePrompt>;
}
export interface ImagePrompt {
    bottomText: string;
    topText: string;
    imagePrompt: string;
}
export type Hashtag = string;
export type Description = string;
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface backendInterface {
    generatePins(blogUrl: string): Promise<PinterestPinContent>;
    getAllGeneratedPins(): Promise<Array<PinterestPinContent>>;
    getGeneratedPinsByUrl(url: string): Promise<PinterestPinContent>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
}
