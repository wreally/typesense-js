"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Document = void 0;
var tslib_1 = require("tslib");
var Collections_1 = tslib_1.__importDefault(require("./Collections"));
var Documents_1 = tslib_1.__importDefault(require("./Documents"));
var Document = /** @class */ (function () {
    function Document(collectionName, documentId, apiCall) {
        this.collectionName = collectionName;
        this.documentId = documentId;
        this.apiCall = apiCall;
    }
    Document.prototype.retrieve = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.apiCall.get(this.endpointPath())];
            });
        });
    };
    Document.prototype.delete = function (options) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.apiCall.delete(this.endpointPath(), options)];
            });
        });
    };
    Document.prototype.update = function (partialDocument, options) {
        if (options === void 0) { options = {}; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.apiCall.patch(this.endpointPath(), partialDocument, options)];
            });
        });
    };
    Document.prototype.endpointPath = function () {
        return "".concat(Collections_1.default.RESOURCEPATH, "/").concat(encodeURIComponent(this.collectionName)).concat(Documents_1.default.RESOURCEPATH, "/").concat(encodeURIComponent(this.documentId));
    };
    return Document;
}());
exports.Document = Document;
//# sourceMappingURL=Document.js.map