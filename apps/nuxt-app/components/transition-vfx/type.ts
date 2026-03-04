export enum TransitionName {
  SHATTER = 'shatter',
  DISSOLVE = 'dissolve',
  DISINTEGRATE = 'disintegrate',
  TURBULENCE = 'turbulence',
}

// #region TransitionShatter
interface TransitionShatter {
  name: `${TransitionName.SHATTER}`
}
// #endregion TransitionDissolve

// #region TransitionDissolve
interface TransitionDissolve {
  name: `${TransitionName.DISSOLVE}`
}
// #endregion TransitionDissolve

// #region TransitionDisintegrate
interface TransitionDisintegrate {
  name: `${TransitionName.DISINTEGRATE}`
}
// #endregion TransitionDisintegrate

// #region TransitionTurbulence
interface TransitionTurbulence {
  name: `${TransitionName.TURBULENCE}`
}
// #endregion TransitionTurbulence

// #region TransitionParams
export type TransitionParams =
  TransitionShatter |
  TransitionDissolve |
  TransitionDisintegrate |
  TransitionTurbulence
// #endregion TransitionParams

export interface ActorInstance {
  init: (el: HTMLElement, rate: number) => Promise<void>
  enter: () => Promise<void>
  leave: () => Promise<void>
}
