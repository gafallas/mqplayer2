import {Component, Input, OnInit} from "@angular/core";
import {FileComponent} from "../file/file.component";
import {ActivatedRoute, Router} from "@angular/router";
import {DriveFile} from "../../../services/drive/drive-file";
import {DriveService} from "../../../services/drive/drive-service";

@Component({
    moduleId: module.id,
    templateUrl: "folder.html",
    directives: [FileComponent]
})
export class FolderComponent implements OnInit {
    folder: DriveFile;
    selectedFiles: FileComponent[];
    selectedFile: FileComponent;
    loading: boolean;
    private paramsObserver;
    
    constructor(
        private driveService: DriveService,
        private route: ActivatedRoute,
        private router: Router) {
    }

    ngOnInit() {
        this.paramsObserver = this.route.params.subscribe(params => {
            this.showFolder(params['id'] || 'root');
        });
    }

    ngOnDestroy() {
        this.paramsObserver.unsubscribe();
    }

    selectFile(file: FileComponent) {
        if (this.selectedFile) {
            this.selectedFile.isSelected = false;
        }
        file.isSelected = true;
        this.selectedFile = file;
    }

    navigateToFolder(file: FileComponent) {
        if (file.file.isFolder) {
            this.router.navigate(['/folders', file.file.id]);
        }
    }

    showFolder(id: string) {
        this.loading = true;
        this.driveService.getFile(id)
            .then(file => {
                this.folder = file;
                return this.driveService.getChildren(file);
            })
            .finally(() => {
                this.loading = false;
            });
    }
}