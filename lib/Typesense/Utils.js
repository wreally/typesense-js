"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.combineAndFlattenArraySearchParams = void 0;
var tslib_1 = require("tslib");
var Documents_1 = require("./Documents");
/**
 * Combines and flattens array search parameters into a string representation.
 * This function takes an object of search parameters, where some values may be arrays, and returns a new object.
 * In the returned object, array values are converted to comma-separated strings, while non-array values are kept as-is.
 * This is useful for preparing search parameters for API requests where array parameters need to be serialized.
 *
 * @param params - The search parameters object, potentially containing array values for certain keys.
 *
 * @example
 * // Given search parameters with array and non-array values const searchParams = {
 *   tags: ["tag1", "tag2"],
 *   category: "news",
 *   ids: [1, 2, 3]
 * };
 *
 * // Using combineAndFlattenArraySearchParams:
 * const flattenedParams = combineAndFlattenArraySearchParams(searchParams);
 *
 * // The returned object will be:
 * // {
 * //   tags: "tag1,tag2",
 * //   category: "news",
 * //   ids: "1,2,3"
 * // }
 */
function combineAndFlattenArraySearchParams(params) {
    var arrayblePart = Object.entries(params)
        .filter(function (_a) {
        var key = _a[0];
        return Documents_1.searchParamsArrayKeys[key];
    })
        .map(function (_a) {
        var key = _a[0], value = _a[1];
        if (Array.isArray(value)) {
            return [key, value.join(",")];
        }
        return [key, value];
    });
    return tslib_1.__assign(tslib_1.__assign({}, params), Object.fromEntries(arrayblePart));
}
exports.combineAndFlattenArraySearchParams = combineAndFlattenArraySearchParams;
//# sourceMappingURL=Utils.js.map