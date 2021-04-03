export function errorToJSON(err: String): { error: String } {
    return {
        "error": err
    }
}
