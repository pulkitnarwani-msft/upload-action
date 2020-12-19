import * as core from '@actions/core';
import * as mime from 'mime-types';
import { promises as fs } from 'fs';
import { join } from 'path';
import { BlobServiceClient } from '@azure/storage-blob';
import { basename, relative } from 'path';
import { connect } from 'http2';


async function run(){
    const connection_string = core.getInput('connection_string');
    const artifact_path = core.getInput('artifact_path');    

    const blobServiceClient = BlobServiceClient.fromConnectionString(connection_string);

    const containerClient = blobServiceClient.getContainerClient('artifact'); //assuming container exists. TODO: Check and create if doesn't exist.
    
    const stat = await fs.lstat(artifact_path);
    if (stat.isDirectory()) {
        for (const src of await walk(artifact_path)) {
        const dst = ['artifact', relative(artifact_path, src).replace(/\\/g, '/')].join('/');        

        const mt = mime.lookup(src);
        const blobHTTPHeaders = mt? {blobContentType: mt,}: {};
        const blockClient = containerClient.getBlockBlobClient(dst);
        await blockClient.uploadFile(src, {
            blobHTTPHeaders,
        });
        }
    } 
      
}



run().catch(e => {
    core.debug(e.stack);
    core.error(e.message);
    core.setFailed(e.message);
});

async function walk(dir: string) {
  async function _walk(dir: string, fileList: string[]) {
    const files = await fs.readdir(dir);
    for (const file of files) {
      const path = join(dir, file);
      const stat = await fs.lstat(path);
      if (stat.isDirectory()) {
        fileList = await _walk(path, fileList);
      } else {
        fileList.push(path);
      }
    }
    return fileList;
  }
  return await _walk(dir, []);
}