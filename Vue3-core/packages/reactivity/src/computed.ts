import { isFunction } from '@vue/shared'
import {
  type DebuggerEvent,
  type DebuggerOptions,
  EffectFlags,
  type Subscriber,
  activeSub,
  batch,
  refreshComputed,
} from './effect'
import type { Ref } from './ref'
import { warn } from './warning'
import { Dep, type Link, globalVersion } from './dep'
import { ReactiveFlags, TrackOpTypes } from './constants'

declare const ComputedRefSymbol: unique symbol
declare const WritableComputedRefSymbol: unique symbol

interface BaseComputedRef<T, S = T> extends Ref<T, S> {
  [ComputedRefSymbol]: true
  /**
   * @deprecated computed no longer uses effect
   */
  effect: ComputedRefImpl
}

export interface ComputedRef<T = any> extends BaseComputedRef<T> {
  readonly value: T
}

export interface WritableComputedRef<T, S = T> extends BaseComputedRef<T, S> {
  [WritableComputedRefSymbol]: true
}

export type ComputedGetter<T> = (oldValue?: T) => T
export type ComputedSetter<T> = (newValue: T) => void

export interface WritableComputedOptions<T, S = T> {
  get: ComputedGetter<T>
  set: ComputedSetter<S>
}

/**
 * @private exported by @vue/reactivity for Vue core use, but not exported from
 * the main vue package
 */
export class ComputedRefImpl<T = any> implements Subscriber {
  /**
   * @internal
   */
  _value: any = undefined
  /**
   * @internal
   */
  readonly dep: Dep = new Dep(this)
  /**
   * @internal
   */
  readonly __v_isRef = true
  // TODO isolatedDeclarations ReactiveFlags.IS_REF
  /**
   * @internal
   */
  readonly __v_isReadonly: boolean
  // TODO isolatedDeclarations ReactiveFlags.IS_READONLY
  // A computed is also a subscriber that tracks other deps
  /**
   * @internal
   */
  deps?: Link = undefined
  /**
   * @internal
   */
  depsTail?: Link = undefined
  /**
   * @internal
   */
  flags: EffectFlags = EffectFlags.DIRTY
  /**
   * @internal
   */
  globalVersion: number = globalVersion - 1
  /**
   * @internal
   */
  isSSR: boolean
  /**
   * @internal
   */
  next?: Subscriber = undefined

  // for backwards compat
  effect: this = this
  /** fengpu: 他本身是一个可以被收集的依赖 */
  // dev only
  onTrack?: (event: DebuggerEvent) => void
  // dev only
  onTrigger?: (event: DebuggerEvent) => void

  /**
   * Dev only
   * @internal
   */
  _warnRecursive?: boolean

  constructor(
    public fn: ComputedGetter<T>,
    private readonly setter: ComputedSetter<T> | undefined,
    isSSR: boolean,
  ) {
    this[ReactiveFlags.IS_READONLY] = !setter
    this.isSSR = isSSR
  }

  /**
   * @internal
   */
  notify(): true | void {
    console.log('computed notify----')
    this.flags |= EffectFlags.DIRTY
    if (
      !(this.flags & EffectFlags.NOTIFIED) &&
      // avoid infinite self recursion
      activeSub !== this
    ) {
      batch(this, true)
      return true
    } else if (__DEV__) {
      // TODO warn
    }
  }
  /**
   *
   */
  /**
   * author: fengpu
   * 一般的ref，在get value的时候，收集订阅，在set value的时候，触发依赖更新
   * computed对应的ref，在get的时候，收集订阅。同时，他自身也是一个订阅者，会被get时候使用的响应式数据收集。
   * 在set的时候
   *  不是触发订阅更新，而是先使得自己dirty为true，再通知他收集的订阅执行，订阅执行时，发现计算属性的dirty为true，从而使得自己的get执行
   *  在是引用类型的时候，也不用创建代理，直接返回
   *    这个计算属性自己的set做两件事
   *      一个是将dirty属性置为true
   *      一个是触发依赖计算属性的依赖更新
   *  同时，计算属性的value值改变，也会触发set
   *  所以，导致计算属性的set函数执行:
   *    1、他依赖的响应式数据trigger
   *    2、自己的value属性值改变
   *
   * 在get的时候，先触发value的get，验证dirty，通过再调用computed.fn
   *  只要访问了value，就会触发get value，除非是value赋值，才会触发set value
   *  所以注册的get回调，实际上只会在dirty为true的时候执行
   *
   * onTrigger
   *  包含在自己的副作用函数中，当依赖的响应式数据改变，会调用这个副作用 （fengpuTODO：需要验证）
   *
   * 问题：
   *  triggerRef一个shallowRef
   *    1、为啥不触发set
   *      实际上 响应数据的更新只会触发当前属性的set，而不是ref.value的set （fengpuTODO：待验证）
   *      set是拿到dep，触发dep的一个方式，而不是dep触发一定来自set，并且set也不一定触发dep更新（计算属性的set就没有，只是一个回调而已）
   *    2、为啥不触发onTrigger
   *    3、从哪里得到的dep
   *      triggerRef(childArr) == childArr.dep.trigger()
        
   */
  get value(): T {
    console.log('---------get computed,not fn--------')
    /**
     * author:fengpu
     * computed构造函数定义的get实际上是computed.fn，一个在dirty为true才会触发的回调函数
     * computed.fn不是访问就会触发，而是新旧值对比之后，不同才会触发，它实际上不是value的get，而是computed的get的一个回调函数
     * get触发时机：
     *  只要computed改变，就会触发，哪怕是引用值的深度属性改变，也会触发，只是对比value没有变化，不会触发fn回调
     *  get的时候，也会收集依赖（传过来的响应式数据，不是computed收集的依赖）
     */
    const link = __DEV__
      ? this.dep.track({
          target: this,
          type: TrackOpTypes.GET,
          key: 'value',
        })
      : this.dep.track()//收集正在get他的activeSub副作用函数
    refreshComputed(this)//computed变为activeSub，执行被其依赖收集逻辑
    // sync version after evaluation
    if (link) {
      link.version = this.dep.version
    }
    return this._value
  }

  set value(newValue) {
    console.log('computed setter---')
    if (this.setter) {
      this.setter(newValue)
    } else if (__DEV__) {
      warn('Write operation failed: computed value is readonly')
    }
  }
}

/**
 * Takes a getter function and returns a readonly reactive ref object for the
 * returned value from the getter. It can also take an object with get and set
 * functions to create a writable ref object.
 *
 * @example
 * ```js
 * // Creating a readonly computed ref:
 * const count = ref(1)
 * const plusOne = computed(() => count.value + 1)
 *
 * console.log(plusOne.value) // 2
 * plusOne.value++ // error
 * ```
 *
 * ```js
 * // Creating a writable computed ref:
 * const count = ref(1)
 * const plusOne = computed({
 *   get: () => count.value + 1,
 *   set: (val) => {
 *     count.value = val - 1
 *   }
 * })
 *
 * plusOne.value = 1
 * console.log(count.value) // 0
 * ```
 *
 * @param getter - Function that produces the next value.
 * @param debugOptions - For debugging. See {@link https://vuejs.org/guide/extras/reactivity-in-depth.html#computed-debugging}.
 * @see {@link https://vuejs.org/api/reactivity-core.html#computed}
 */
export function computed<T>(
  getter: ComputedGetter<T>,
  debugOptions?: DebuggerOptions,
): ComputedRef<T>
export function computed<T, S = T>(
  options: WritableComputedOptions<T, S>,
  debugOptions?: DebuggerOptions,
): WritableComputedRef<T, S>
export function computed<T>(
  getterOrOptions: ComputedGetter<T> | WritableComputedOptions<T>,
  debugOptions?: DebuggerOptions,
  isSSR = false,
) {
  let getter: ComputedGetter<T>
  let setter: ComputedSetter<T> | undefined

  if (isFunction(getterOrOptions)) {
    getter = getterOrOptions
  } else {
    getter = getterOrOptions.get
    setter = getterOrOptions.set
  }
  const cRef = new ComputedRefImpl(getter, setter, isSSR)

  if (__DEV__ && debugOptions && !isSSR) {
    cRef.onTrack = debugOptions.onTrack
    cRef.onTrigger = debugOptions.onTrigger
  }
  return cRef as any
}
