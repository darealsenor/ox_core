import { netEvent } from 'utils';
import type { Character, Dict, OxGroup, OxStatus, PlayerMetadata } from 'types';
import { GetGroupPermissions } from '../../common';

export const Statuses: Dict<OxStatus> = {};
const callableMethods: Dict<true> = {};

class PlayerSingleton {
  userId: number;
  charId?: number;
  #isLoaded: boolean;
  #state: StateBagInterface;

  constructor() {
    this.#isLoaded = false;
    this.#state = LocalPlayer.state;

    Object.entries(Object.getOwnPropertyDescriptors(this.constructor.prototype)).reduce(
      (methods: { [key: string]: true }, [name, desc]) => {
        if (name !== 'constructor' && desc.writable && typeof desc.value === 'function') methods[name] = true;

        return methods;
      },
      callableMethods,
    );

    exports('GetPlayer', () => this);

    exports('GetPlayerCalls', () => callableMethods);

    exports('CallPlayer', (method: string, ...args: any[]) => {
      const fn = (this as any)[method];

      if (!fn) return console.error(`cannot call method ${method} (method does not exist)`);

      if (!callableMethods[method]) return console.error(`cannot call method ${method} (method is not exported)`);

      return fn.bind(this)(...args); // why :\
    });
  }

  get isLoaded() {
    return this.#isLoaded;
  }

  set isLoaded(state: boolean) {
    this.#isLoaded = state;
  }

  get state() {
    return this.#state;
  }

}

export const OxPlayer = new PlayerSingleton();

