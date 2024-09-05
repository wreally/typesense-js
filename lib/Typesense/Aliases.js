"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var RESOURCEPATH = "/aliases";
var Aliases = /** @class */ (function () {
    function Aliases(apiCall) {
        this.apiCall = apiCall;
    }
    Aliases.prototype.upsert = function (name, mapping) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.apiCall.put(this.endpointPath(name), mapping)];
            });
        });
    };
    Aliases.prototype.retrieve = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.apiCall.get(RESOURCEPATH)];
            });
        });
    };
    Aliases.prototype.endpointPath = function (aliasName) {
        return "".concat(Aliases.RESOURCEPATH, "/").concat(encodeURIComponent(aliasName));
    };
    Object.defineProperty(Aliases, "RESOURCEPATH", {
        get: function () {
            return RESOURCEPATH;
        },
        enumerable: false,
        configurable: true
    });
    return Aliases;
}());
exports.default = Aliases;
//# sourceMappingURL=Aliases.js.map