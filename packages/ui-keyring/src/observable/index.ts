// Copyright 2017-2018 @polkadot/ui-keyring authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { KeyringJson } from '../types';
import { AccountSubject, AddressSubject, KeyringObservableInstance, SingleAddress, SubjectInfo } from './types';

import store from 'store';
import { combineLatest, BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import createOptionItem from '../options/item';
import { accountKey, addressKey } from '../defaults';

class KeyringObservable implements KeyringObservableInstance {
  private _accounts: AccountSubject;
  private _addresses: AddressSubject;
  private _all: Observable<any>;
  private _isDevelopment: boolean;
  private _subject: BehaviorSubject<boolean>;

  constructor () {
    this._subject = new BehaviorSubject(false);
    this._isDevelopment = this._subject.getValue();
    this._accounts = this.genericSubject(accountKey, true);
    this._addresses = this.genericSubject(addressKey);
    this._all = this.observableAll();
  }

  get accounts (): AccountSubject {
    return this._accounts;
  }

  get addresses (): AddressSubject {
    return this._addresses;
  }

  get all (): Observable<any> {
    return this._all;
  }

  get isDevelopment (): boolean {
    return this._isDevelopment;
  }

  private genericSubject (keyCreator: (address: string) => string, withTest: boolean = false): AddressSubject {
    let current: SubjectInfo = {};
    const subject = new BehaviorSubject({});
    const next = (): void => {
      const isDevMode = this.isDevelopment;

      subject.next(
        Object
          .keys(current)
          .reduce((filtered, key) => {
            const { json: { meta: { isTesting = false } = {} } = {} } = current[key];

            if (!withTest || isDevMode || isTesting !== true) {
              filtered[key] = current[key];
            }

            return filtered;
          }, {} as SubjectInfo)
      );
    };

    subject.subscribe(next);

    return {
      add: (address: string, json: KeyringJson): SingleAddress => {
        current = { ...current };

        current[address] = {
          json,
          option: createOptionItem(address, json.meta.name)
        };

        store.set(keyCreator(address), json);
        next();

        return current[address];
      },
      remove: (address: string) => {
        current = { ...current };

        delete current[address];

        store.remove(keyCreator(address));
        next();
      },
      subject
    };
  }

  observableAll (): Observable<any> {
    return combineLatest(
      this.accounts.subject,
      this.addresses.subject
    ).pipe(
      map(([accounts, addresses]) => ({
        accounts,
        addresses
      }))
    );
  }

  setDevMode (isDevelopment: boolean): void {
    this._subject = this._subject.next(isDevelopment);
  }
}

const keyringObservableInstance = new KeyringObservable();

export default keyringObservableInstance;
