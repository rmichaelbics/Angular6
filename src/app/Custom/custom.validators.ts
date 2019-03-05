import { AbstractControl } from '@angular/forms';


export class CustomValidatior {
    static emailDomain(domainName: string) {
        return (control: AbstractControl): { [key: string]: any } | null => {
            const email: string = control.value;
            console.log(email);
            if (email !== '' && email !== undefined) {
                const domain = email.substring(email.lastIndexOf('@') + 1);
                if (domain === '' || domain.toLowerCase() === domainName.toLowerCase()) {
                    return null;
                } else {
                    return { ['emailDomain']: true };
                }
            }
        };
    }
}
