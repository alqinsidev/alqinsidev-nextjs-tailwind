export interface Asset {
    name: string;
    type: string;
    uri: string;
}

export interface Project {
    assets: Asset[];
    contribution: string;
    name: string;
    summary: string;
    tags: string[];
}