import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Birthday } from '../../models/birthday';

/*
  Generated class for the BirthdayServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/

/*
    Service to handle the calls to Ionic Storage.
    This service has a method to get data from the database and deserialize it into Birthday objects. And it will also
    have a method to save the data as JSON.
 */

@Injectable()
export class BirthdayService {

    private STORAGE_KEY = 'BIRTHDAYS';

    constructor (private storage: Storage) { }

    saveAll(birthdays: Birthday[]): Promise<any> {
        return this.storage.set(this.STORAGE_KEY, JSON.stringify(birthdays));
    }

    getAll(): Promise<Birthday[]> {
        return this.storage.ready()
            .then(() => this.storage.get(this.STORAGE_KEY))
            .then(data => {

                const birthdays = JSON.parse(data);

                if (birthdays) {
                    return birthdays.map(b => Object.assign(new Birthday(), b));
                }

                return [];
            })
    }
}
