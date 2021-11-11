import { Decoder, Encoder, Codec } from "../types"
import { createCodec, toBuffer } from "../utils"
import { U8Dec } from "./U8"
import { Bool } from "./Bool"
import { mergeUint8 } from "@unstoppablejs/utils"

export const OptionDec = <T>(inner: Decoder<T>): Decoder<T | undefined> =>
  toBuffer<T | undefined>((buffer) => {
    const val = U8Dec(buffer)
    if (val === 0) return undefined

    return inner === (Bool[1] as any)
      ? ((val === 1) as unknown as T)
      : inner(buffer)
  })

export const OptionEnc =
  <T>(inner: Encoder<T>): Encoder<T | undefined> =>
  (value) => {
    const result = new Uint8Array(1)
    if (value === undefined) {
      result[0] = 0
      return result
    }

    result[0] = 1
    if (inner === (Bool[0] as any)) {
      result[0] = value ? 1 : 2
      return result
    }

    return mergeUint8(result, inner(value))
  }

export const Option = <T>(inner: Codec<T>): Codec<T | undefined> =>
  createCodec(OptionEnc(inner[0]), OptionDec(inner[1]))
