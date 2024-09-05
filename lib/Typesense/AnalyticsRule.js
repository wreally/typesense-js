"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var AnalyticsRules_1 = tslib_1.__importDefault(require("./AnalyticsRules"));
var AnalyticsRule = /** @class */ (function () {
    function AnalyticsRule(name, apiCall) {
        this.name = name;
        this.apiCall = apiCall;
    }
    AnalyticsRule.prototype.retrieve = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.apiCall.get(this.endpointPath())];
            });
        });
    };
    AnalyticsRule.prototype.delete = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.apiCall.delete(this.endpointPath())];
            });
        });
    };
    AnalyticsRule.prototype.endpointPath = function () {
        return "".concat(AnalyticsRules_1.default.RESOURCEPATH, "/").concat(encodeURIComponent(this.name));
    };
    return AnalyticsRule;
}());
exports.default = AnalyticsRule;
//# sourceMappingURL=AnalyticsRule.js.map