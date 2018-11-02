// Copyright 2017-2018 @polkadot/ui-keyring authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { KeyringObservableStruct } from './types';

import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import accounts from './accounts';
import addresses from './addresses';

class KeyringObservable implements KeyringObservableStruct {
  private _all: Observable<any>;

  constructor () {
    this._all = this.observableAll();
  }

  get all () {
    return this._all;
  }

  private observableAll (): Observable<any> {
    return combineLatest(
      accounts.subject,
      addresses.subject
    ).pipe(
      map(([accounts, addresses]) => ({
        accounts,
        addresses
      }))
    );
  }
}

const keyringObservableInstance = new KeyringObservable();

export default keyringObservableInstance;
