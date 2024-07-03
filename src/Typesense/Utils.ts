import { SearchParams, searchParamsArrayKeys } from "./Documents";

/**
 * Converts each array property of an object type to a string property, while keeping non-array properties unchanged.
 *
 * @typeparam T - The object type whose properties are to be converted.
 *
 * @example
 * // Given an object type with some properties as arrays:
 * type Example = {
 *   ids: number[];
 *   name: string;
 * }
 *
 * // The ConvertArrayToString type will produce:
 * type ConvertedExample = ConvertArrayToString<Example>;
 * // Resulting in:
 * // {
 * //   ids: string;
 * //   name: string;
 * // }
 */
type ConvertArrayToString<T> = {
  [K in keyof T]: T[K] extends unknown[] ? string : T[K];
};

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
export function combineAndFlattenArraySearchParams<T extends SearchParams>(
  params: T,
): ConvertArrayToString<T> {
  const arrayblePart = Object.entries(params)
    .filter(([key]) => searchParamsArrayKeys[key])
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return [key, value.join(",")] as const;
      }

      return [key, value] as const;
    });

  return { ...params, ...Object.fromEntries(arrayblePart) };
}
