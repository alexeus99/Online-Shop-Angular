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
  basket: IProducts[];
  basketSubscription: Subscription;

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
    this.basketSubscription =
      this.ProductsService.getProductFromBasket().subscribe((data) => {
        this.basket = data;
      });
  }

  deleteProduct(id: number) {
    this.ProductsService.deleteProduct(id).subscribe(() =>
      this.products.find((item) => {
        if (id === item.id) {
          let idx = this.products.findIndex((data) => data.id === id);
          this.products.splice(idx, 1);
        }
      })
    );
  }

  postToBasket(product: IProducts) {
    this.ProductsService.postProductToBasket(product).subscribe((data) =>
      this.basket.push(data)
    );
  }

  updateToBasket(product: IProducts) {
    product.quantity += 1;
    this.ProductsService.updateProductToBasket(product).subscribe((data) => {});
  }

  addToBasket(product: IProducts) {
    product.quantity = 1;
    let findItem;

    if (this.basket.length > 0) {
      findItem = this.basket.find((item) => item.id === product.id);
      if(findItem) this.updateToBasket(findItem)
      else this.postToBasket(product);
    } else this.postToBasket(product);
  }

  openDialog(product?: IProducts): void {
    let DialogConfig = new MatDialogConfig();
    DialogConfig.width = '500px';
    DialogConfig.disableClose = true;
    DialogConfig.data = product;

    const dialogRef = this.dialog.open(DialogBoxComponent, DialogConfig);

    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        if (data && data.id) this.updateData(data);
        else this.postData(data);
      }
    });
  }

  updateData(product: IProducts) {
    this.ProductsService.updateProduct(product).subscribe(
      (data) =>
        (this.products = this.products.map((product) => {
          if (product.id === data.id) return data;
          else return product;
        }))
    );
  }

  postData(data: IProducts) {
    this.ProductsService.postProduct(data).subscribe((data) =>
      this.products.push(data)
    );
  }

  ngOnDestroy() {
    if (this.productsSubscription) this.productsSubscription.unsubscribe();
    if (this.basketSubscription) this.basketSubscription.unsubscribe();
  }
}
