import * as request from 'request'
import * as vscode from 'vscode'
import * as path from 'path'
import { ReadmeUri } from '../type-extensions'
import { TestHook } from '../extension'

export class RemoteProvider implements vscode.TextDocumentContentProvider {
    public static SchemaType = "node-readme-remote-data"
    
    public provideTextDocumentContent(uri: vscode.Uri, token: vscode.CancellationToken) {
        const rawUri = ReadmeUri.from(uri).rawUri
        const fragSplit = rawUri.fragment.indexOf('.')
        return this.getReadme(rawUri.with({
            scheme: rawUri.fragment.substring(0, fragSplit),
            fragment: rawUri.fragment.substring(fragSplit + 1)
        }).toString()).then((p) => {
            TestHook.log(uri.toString())
            return p
        })
    }

    public getReadme(path : string) : PromiseLike<string> {
        return new Promise((resolve, reject) => {
            request({
                url: path,
                headers: {
                    "User-Agent": "bengreenier/vscode-node-readme"
                }
            }, (err, res, body) => {
                if (err) reject(err)
                else resolve(body)
            })
        })
    }
}