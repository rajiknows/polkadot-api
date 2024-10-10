import { StringRecord } from "scale-ts"
import { InkMetadata } from "./metadata-types"

export type Event = { type: string; value: unknown }

export interface InkDescriptors<
  S,
  M extends InkCallableDescriptor,
  C extends InkCallableDescriptor,
  E extends Event,
> {
  metadata: InkMetadata
  __types: {
    storage: S
    messages: M
    constructors: C
    event: E
  }
}

export type InkCallableDescriptor = Record<
  string,
  {
    message: StringRecord<unknown>
    response: StringRecord<unknown>
  }
>