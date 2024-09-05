"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Stopwords_1 = tslib_1.__importDefault(require("./Stopwords"));
var Stopword = /** @class */ (function () {
    function Stopword(stopwordId, apiCall) {
        this.stopwordId = stopwordId;
        this.apiCall = apiCall;
    }
    Stopword.prototype.retrieve = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.apiCall.get(this.endpointPath())];
            });
        });
    };
    Stopword.prototype.delete = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.apiCall.delete(this.endpointPath())];
            });
        });
    };
    Stopword.prototype.endpointPath = function () {
        return "".concat(Stopwords_1.default.RESOURCEPATH, "/").concat(encodeURIComponent(this.stopwordId));
    };
    return Stopword;
}());
exports.default = Stopword;
//# sourceMappingURL=Stopword.js.map