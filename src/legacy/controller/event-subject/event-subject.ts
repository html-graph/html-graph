import { GraphEvent } from "../models/event-payloads";
import { GraphEventType } from "../models/graph-event";

// https://medium.com/@aungmo/leveraging-advanced-typescript-features-for-dynamic-function-arguments-d54771eee642

export class EventSubject {
    private mapping = new Map<GraphEventType, any[]>();

    on<Type extends GraphEvent["type"]>(
      ...args: Extract<GraphEvent, { type: Type }> extends { payload: infer TPayload } ? [Type, (payload: TPayload) => void] : [Type, () => void]
    ): void {
        const [type, callback] = args;
        const callbacks = this.mapping.get(type);

        if (callbacks !== undefined) {
            callbacks.push(callback);
        } else {
            this.mapping.set(type, [callback]);
        }
    }


    dispatch<Type extends GraphEvent["type"]>(
      ...args: Extract<GraphEvent, { type: Type }> extends { payload: infer TPayload } ? [Type, TPayload] : [Type]
    ): void {
        const [type, payload] = args;
        const callbacks = this.mapping.get(type);

        if (callbacks !== undefined) {
            callbacks.forEach(callback => {
                if (payload !== undefined) {
                    callback(payload);
                } else {
                    callback();
                }
            });
        }
    }
}
