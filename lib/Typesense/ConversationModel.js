"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var ConversationModels_1 = tslib_1.__importDefault(require("./ConversationModels"));
var ConversationModel = /** @class */ (function () {
    function ConversationModel(id, apiCall) {
        this.id = id;
        this.apiCall = apiCall;
    }
    ConversationModel.prototype.update = function (params) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.apiCall.put(this.endpointPath(), params)];
            });
        });
    };
    ConversationModel.prototype.retrieve = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.apiCall.get(this.endpointPath())];
            });
        });
    };
    ConversationModel.prototype.delete = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.apiCall.delete(this.endpointPath())];
            });
        });
    };
    ConversationModel.prototype.endpointPath = function () {
        return "".concat(ConversationModels_1.default.RESOURCEPATH, "/").concat(encodeURIComponent(this.id));
    };
    return ConversationModel;
}());
exports.default = ConversationModel;
//# sourceMappingURL=ConversationModel.js.map