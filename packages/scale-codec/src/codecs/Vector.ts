import { createCodec, toBuffer } from "../utils"
import { Codec, Decoder, Encoder } from "../types"
import { CompatDec, CompatEnc } from "./Compat"
import { mergeUint8 } from "@unstoppablejs/utils"

const encodeBytes = (value: Uint8Array) =>
  mergeUint8(CompatEnc(value.length), value)

export function VectorEnc<T>(inner: Encoder<T>): Encoder<Array<T>>
export function VectorEnc(
  inner: Encoder<number>,
  asBytes: true,
): Encoder<Uint8Array>
export function VectorEnc(inner: Encoder<any>, asBytes: boolean = false) {
  return asBytes
    ? encodeBytes
    : (value: Array<any>) =>
        mergeUint8(CompatEnc(value.length), ...value.map(inner))
}

export function VectorDec<T>(getter: Decoder<T>): Decoder<Array<T>>
export function VectorDec(
  getter: Decoder<number>,
  asBytes: true,
): Decoder<Uint8Array>
export function VectorDec(getter: Decoder<any>, asBytes: boolean = false) {
  const constructor = asBytes ? Uint8Array : Array
  return toBuffer((buffer) => {
    let nElements = CompatDec(buffer)
    const result = new constructor(nElements as number)

    for (let i = 0; i < nElements; i++) {
      const current = getter(buffer)
      result[i] = current
    }

    return result
  })
}

export function Vector<T>(inner: Codec<T>): Codec<Array<T>>
export function Vector(inner: Codec<number>, asBytes: true): Codec<Uint8Array>
export function Vector(
  inner: Codec<any>,
  asBytes: boolean = false,
): Codec<Array<any>> | Codec<Uint8Array> {
  return createCodec(
    VectorEnc(inner[0], asBytes as any),
    VectorDec(inner[1], asBytes as any),
  )
}
