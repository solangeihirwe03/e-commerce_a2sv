import { Request } from "express";
export interface ExtendRequest extends Request{
    user? :user;
    article? :article;
    file? : any
}