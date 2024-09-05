"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var RESOURCEPATH = "/stopwords";
var Stopwords = /** @class */ (function () {
    function Stopwords(apiCall) {
        this.apiCall = apiCall;
    }
    Stopwords.prototype.upsert = function (stopwordId, params) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.apiCall.put(this.endpointPath(stopwordId), params)];
            });
        });
    };
    Stopwords.prototype.retrieve = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.apiCall.get(this.endpointPath())];
            });
        });
    };
    Stopwords.prototype.endpointPath = function (operation) {
        return "".concat(Stopwords.RESOURCEPATH).concat(operation === undefined ? "" : "/" + encodeURIComponent(operation));
    };
    Object.defineProperty(Stopwords, "RESOURCEPATH", {
        get: function () {
            return RESOURCEPATH;
        },
        enumerable: false,
        configurable: true
    });
    return Stopwords;
}());
exports.default = Stopwords;
//# sourceMappingURL=Stopwords.js.map