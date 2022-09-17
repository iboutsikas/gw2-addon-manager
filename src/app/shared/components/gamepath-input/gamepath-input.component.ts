import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ElectronService } from 'app/core/services';
import { FilePathValidator } from 'app/shared/validators/filepath.validator';
import { filter, map, Subscription } from 'rxjs';

@Component({
  selector: 'app-gamepath-input',
  templateUrl: './gamepath-input.component.html',
  styleUrls: ['./gamepath-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GamepathInputComponent implements OnDestroy {

  @Input()
  get path(): string | null {
    if (!this.group.valid)
      return null;

    return this.group.controls['gamepath'].value;
  }

  set path(p: string | null) {
    p = p || '';
    console.log(p);
    this.group.patchValue({ 'gamepath': p });
  }

  @Output()
  pathChanged = new EventEmitter<string>();

  group: FormGroup;

  private sub: Subscription;

  constructor(fb: FormBuilder, 
    private filepathValidator: FilePathValidator, 
    private es: ElectronService,
    private cd: ChangeDetectorRef
  ) {
    this.group = fb.group({
      gamepath: ['', this.filepathValidator.validate.bind(this.filepathValidator)]
    })

    this.sub = this.group.valueChanges.pipe(
      filter(_ => this.group.valid),
      map(values => values.gamepath)
    ).subscribe(gamepath => {
      this.pathChanged.emit(gamepath);
    })
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  async onBrowseCliked() {
    const result: any = await this.es.openGamepathDialog();
    if (result.canceled)
      return;

    this.group.patchValue({ 'gamepath': result.filePaths[0] });
    this.cd.detectChanges();
  }

}
