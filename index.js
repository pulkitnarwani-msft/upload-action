"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var core = require("@actions/core");
var mime = require("mime-types");
var fs_1 = require("fs");
var path_1 = require("path");
var storage_blob_1 = require("@azure/storage-blob");
var path_2 = require("path");
function run() {
    return __awaiter(this, void 0, void 0, function () {
        var connection_string, artifact_path, blobServiceClient, containerClient, stat, _i, _a, src, dst, mt, blobHTTPHeaders, blockClient;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    connection_string = "DefaultEndpointsProtocol=https;AccountName=pnartifacts;AccountKey=TvupnQRfs7rWqKBlvsUUaGpksObEL8KPnaBMO7/fylEFv6YbZ8SVzqk38JeQaYmJ/YmzAVIBI6MbXBdQNeJiQg==;EndpointSuffix=core.windows.net";
                    artifact_path = "./artifact";
                    blobServiceClient = storage_blob_1.BlobServiceClient.fromConnectionString(connection_string);
                    containerClient = blobServiceClient.getContainerClient('artifact');
                    return [4 /*yield*/, fs_1.promises.lstat(artifact_path)];
                case 1:
                    stat = _b.sent();
                    if (!stat.isDirectory()) return [3 /*break*/, 6];
                    _i = 0;
                    return [4 /*yield*/, walk(artifact_path)];
                case 2:
                    _a = _b.sent();
                    _b.label = 3;
                case 3:
                    if (!(_i < _a.length)) return [3 /*break*/, 6];
                    src = _a[_i];
                    dst = ['artifact', path_2.relative(artifact_path, src).replace(/\\/g, '/')].join('/');
                    mt = mime.lookup(src);
                    blobHTTPHeaders = mt ? { blobContentType: mt } : {};
                    blockClient = containerClient.getBlockBlobClient(dst);
                    return [4 /*yield*/, blockClient.uploadFile(src, {
                            blobHTTPHeaders: blobHTTPHeaders
                        })];
                case 4:
                    _b.sent();
                    _b.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 3];
                case 6: return [2 /*return*/];
            }
        });
    });
}
run()["catch"](function (e) {
    core.debug(e.stack);
    core.error(e.message);
    core.setFailed(e.message);
});
function walk(dir) {
    return __awaiter(this, void 0, void 0, function () {
        function _walk(dir, fileList) {
            return __awaiter(this, void 0, void 0, function () {
                var files, _i, files_1, file, path, stat;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, fs_1.promises.readdir(dir)];
                        case 1:
                            files = _a.sent();
                            _i = 0, files_1 = files;
                            _a.label = 2;
                        case 2:
                            if (!(_i < files_1.length)) return [3 /*break*/, 7];
                            file = files_1[_i];
                            path = path_1.join(dir, file);
                            return [4 /*yield*/, fs_1.promises.lstat(path)];
                        case 3:
                            stat = _a.sent();
                            if (!stat.isDirectory()) return [3 /*break*/, 5];
                            return [4 /*yield*/, _walk(path, fileList)];
                        case 4:
                            fileList = _a.sent();
                            return [3 /*break*/, 6];
                        case 5:
                            fileList.push(path);
                            _a.label = 6;
                        case 6:
                            _i++;
                            return [3 /*break*/, 2];
                        case 7: return [2 /*return*/, fileList];
                    }
                });
            });
        }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, _walk(dir, [])];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
