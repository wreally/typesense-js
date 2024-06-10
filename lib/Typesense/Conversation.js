"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Conversations_1 = tslib_1.__importDefault(require("./Conversations"));
var Conversation = /** @class */ (function () {
    function Conversation(id, apiCall) {
        this.id = id;
        this.apiCall = apiCall;
    }
    Conversation.prototype.retrieve = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.apiCall.get(this.endpointPath())];
            });
        });
    };
    Conversation.prototype.update = function (params) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.apiCall.put(this.endpointPath(), params)];
            });
        });
    };
    Conversation.prototype.delete = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.apiCall.delete(this.endpointPath())];
            });
        });
    };
    Conversation.prototype.endpointPath = function () {
        return "".concat(Conversations_1.default.RESOURCEPATH, "/").concat(encodeURIComponent(this.id));
    };
    return Conversation;
}());
exports.default = Conversation;
//# sourceMappingURL=Conversation.js.map