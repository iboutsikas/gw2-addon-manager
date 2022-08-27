import { Injectable } from "@angular/core";
import { AbstractControl } from "@angular/forms";
import { ElectronService } from "../../core/services";

@Injectable({
    providedIn: 'root'
})
export class FilePathValidator {

    constructor(private electronService: ElectronService) {

    }

    public validate(control: AbstractControl) {

        if (control.value == '')
            return { invalidPath: true }

        if (!this.electronService.isElectron) {
            return { invalidPath: false };
        }
        
        const pathExists = this.electronService.fs.existsSync(control.value);

        if (!pathExists)
            return { doesNotExist: control.value };

        const correctExe = this.electronService.fs.existsSync(`${control.value}/Gw2-64.exe`);

        return correctExe ? null : { noExe: control.value };
    }

}

export function ValidateUrl(control: AbstractControl) {
    if (!control.value.startsWith('https') || !control.value.includes('.io')) {
        return { invalidUrl: true };
    }
    return null;
}