// Copyright 2017-2018 @polkadot/ui-keyring authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import accounts from './accounts';
import addresses from './addresses';

class KeyringObservable {
  private _all: Observable<any>;

  constructor () {
    this._all = combineLatest(
      accounts.subject,
      addresses.subject
    ).pipe(
      map(([accounts, addresses]) => ({
        accounts,
        addresses
      }))
    );
  }

  get all () {
    return this._all;
  }

  observableAll (): Observable<any> {
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
