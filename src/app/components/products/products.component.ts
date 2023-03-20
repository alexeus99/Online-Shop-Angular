import { DialogConfig } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ProductsService } from 'src/app/services/products.service';
import { DialogBoxComponent } from '../dialog-box/dialog-box.component';
import { IProducts } from '../models/products';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  products: IProducts[];
  productsSubscription: Subscription;
  canEdit: boolean = false;

  constructor(
    private ProductsService: ProductsService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // check user type:
    this.canEdit = true;
    this.productsSubscription = this.ProductsService.getProducts().subscribe(
      (data) => {
        this.products = data;
      }
    );
  }

  openDialog(): void {
    let DialogConfig = new MatDialogConfig();
    DialogConfig.width = '500px';
    DialogConfig.disableClose = true;

    const dialogRef = this.dialog.open(DialogBoxComponent, DialogConfig);

    dialogRef.afterClosed().subscribe((data) => this.postData(data))
    }

    postData(data: IProducts) {
      this.ProductsService.postProduct(data).subscribe((data) => this.products.push(data));
    }

  ngOnDestroy() {
    if (this.productsSubscription) this.productsSubscription.unsubscribe();
  }
}
