export default function handleResult(result: any, operation: string, provider: string = "Metamask"): string {
    var message = "";
    if (typeof result === "object" && !("hash" in result)) {
        switch (result?.code) {
            case 4100:
                message = "Permission denied.";
                break;
            case 4200:
                message = `The requested method is not supported by ${provider}.`;
                break;
            case 4900:
                message = `${provider} is disconnected from all chains.`;
                break;
            case 4901:
                message = `${provider} is disconnected from the specified chain.`;
                break;
            case 32003:
                message = `Transaction rejected.`;
                break;
            case 32005:
                message = `Request limit exceeded.`;
                break;
            default:
                message = `${operation} failed. Do you have enough funds?`;
                break;
        }
    }
    return message;
}