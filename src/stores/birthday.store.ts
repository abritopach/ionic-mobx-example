import { observable, action, computed } from 'mobx-angular';
import { Injectable } from "@angular/core";
import { Birthday } from '../models/birthday';
import { UUID } from 'angular2-uuid';

/*
  You probably noticed that we are using another MobX decorator: @action. You don't need to use this decorator, MobX will
  still work without it, but it's a good practice to use this decorator to explicitly define where mutations to
  observable properties happen.
 */

@Injectable()
export class BirthdayStore {
    @observable birthdays: Birthday[] = [];

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
}
