"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Aliases_1 = tslib_1.__importDefault(require("./Aliases"));
var Alias = /** @class */ (function () {
    function Alias(name, apiCall) {
        this.name = name;
        this.apiCall = apiCall;
    }
    Alias.prototype.retrieve = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.apiCall.get(this.endpointPath())];
            });
        });
    };
    Alias.prototype.delete = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.apiCall.delete(this.endpointPath())];
            });
        });
    };
    Alias.prototype.endpointPath = function () {
        return "".concat(Aliases_1.default.RESOURCEPATH, "/").concat(encodeURIComponent(this.name));
    };
    return Alias;
}());
exports.default = Alias;
//# sourceMappingURL=Alias.js.map