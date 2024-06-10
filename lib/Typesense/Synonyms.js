"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Collections_1 = tslib_1.__importDefault(require("./Collections"));
var RESOURCEPATH = "/synonyms";
var Synonyms = /** @class */ (function () {
    function Synonyms(collectionName, apiCall) {
        this.collectionName = collectionName;
        this.apiCall = apiCall;
    }
    Synonyms.prototype.upsert = function (synonymId, params) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.apiCall.put(this.endpointPath(synonymId), params)];
            });
        });
    };
    Synonyms.prototype.retrieve = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.apiCall.get(this.endpointPath())];
            });
        });
    };
    Synonyms.prototype.endpointPath = function (operation) {
        return "".concat(Collections_1.default.RESOURCEPATH, "/").concat(encodeURIComponent(this.collectionName)).concat(Synonyms.RESOURCEPATH).concat(operation === undefined ? "" : "/" + encodeURIComponent(operation));
    };
    Object.defineProperty(Synonyms, "RESOURCEPATH", {
        get: function () {
            return RESOURCEPATH;
        },
        enumerable: false,
        configurable: true
    });
    return Synonyms;
}());
exports.default = Synonyms;
//# sourceMappingURL=Synonyms.js.map