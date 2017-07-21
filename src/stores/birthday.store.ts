import { observable, action, computed } from 'mobx-angular';
import { Injectable } from "@angular/core";
import { Birthday } from '../models/birthday';
import { UUID } from 'angular2-uuid';

import { BirthdayService } from '../providers/birthday-service/birthday-service';
import * as mobx from 'mobx';

/*
  You probably noticed that we are using another MobX decorator: @action. You don't need to use this decorator, MobX will
  still work without it, but it's a good practice to use this decorator to explicitly define where mutations to
  observable properties happen.
 */

@Injectable()
export class BirthdayStore {

    @observable birthdays: Birthday[] = [];
    /*
     Our app also needs a list of today's birthdays. Since this can be derived from the birthdays array, we'll make it
     a @computed property and add it to BirthdayStore. MobX will know that the getter uses the birthdays array, so
     whenever a change happens to that array, it will re-run the getter for birthdaysToday.
     */
    @computed get birthdaysToday() {
        let today = new Date();

        return this.birthdays
            .filter(b => b.parsedDate.getMonth() == today.getMonth() &&
            b.parsedDate.getDate() == today.getDate())
            .map(b => ({
                name: b.name,
                age: today.getFullYear() - b.parsedDate.getFullYear()
            }));
    }


    constructor(private storage: BirthdayService) {

        // Saving data with autorun.

        /*
        // After the data is loaded we'll call mobx.autorun to automatically save whenever a change happens in the array.
        // If you run the app now with ionic serve and check the Console output you'll see that saveData is called
        // directly on load of the app. After that, it's only called when you do modifications and add birthdays.
        // This is normal behavior for the autorun function because it needs that first run to determine which data
        // changes it should react to. In our case, we're calling JSON.stringify(birthdays) on the observable birthdays
        // array so autorun will detect that on the first run and it will invoke the saveData function every time a
        // change happens in the array.
        */

        /*
        this.getData()
            .then(() => mobx.autorun(() => this.saveData()));
            */

        // Saving data with reaction.

        /*
        // The reaction function takes in 2 functions as parameters.
        // In the first function, you need to define which data you want to observe.
        // The second function takes the output of the first function as input and calls the code for saving the data.
        // The first function is returning a shallow copy (using slice()) of the birthdays array. At first, I thought
        // I could just return the birthdays array there, but if you do that no changes will be detected. You need to
        // specifically access the array to get MobX to understand that it needs to react to changes on it. I'm doing
        // that by using slice() as is recommended here (https://github.com/mobxjs/mobx/issues/248#issuecomment-218927070).
        // When you load the app again, you'll see that saveData is now only called when you add/update/delete a birthday.
         */

        this.getData()
            .then(() => mobx.reaction(
                () => this.birthdays.slice(),
                    birthdays => this.saveData()
            ));
    }

    private getData() {
        return this.storage
            .getAll()
            .then(data => {
                this.birthdays = data;
            });
    }

    // The saveData method will be called after the array is changed, so if it fails to save the data, we'll reload
    // data from the database, so it's kept in sync.
    private saveData() {

        this.storage.saveAll(this.birthdays)
            .catch(() => {
                console.error('Uh oh... something went wrong, reloading data...');
                this.getData();
            })

    }

    @action addBirthday(birthday: Birthday) {
        birthday.id = UUID.UUID();
        this.birthdays.push(birthday);
    }

    @action deleteBirthday(birthday: Birthday) {
        let index = this.birthdays.findIndex(b => b.id == birthday.id);
        this.birthdays.splice(index, 1);
    }

    @action updateBirthday(birthday: Birthday) {
        let index = this.birthdays.findIndex(b => b.id == birthday.id);
        this.birthdays[index] = birthday;
    }


}
