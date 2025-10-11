import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [],
  templateUrl: './pagination.html'
})
export class PaginationComponent {
  // Inputs
  readonly totalItems = input<number>(0);
  readonly itemsPerPage = input<number>(10);
  readonly currentPage = input<number>(1);
  readonly maxVisiblePages = input<number>(5);

  // Outputs
  readonly pageChange = output<number>();

  get totalPages(): number {
    return Math.ceil(this.totalItems() / this.itemsPerPage());
  }

  getVisiblePages(): number[] {
    const total = this.totalPages;
    const current = this.currentPage();
    const maxVisible = this.maxVisiblePages();
    const pages: number[] = [];
    
    // Calcular el rango de páginas a mostrar
    let start = Math.max(1, current - Math.floor(maxVisible / 2));
    let end = Math.min(total, start + maxVisible - 1);
    
    // Ajustar si estamos cerca del final
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.pageChange.emit(page);
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages) {
      this.pageChange.emit(this.currentPage() + 1);
    }
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.pageChange.emit(this.currentPage() - 1);
    }
  }

  get hasPrevious(): boolean {
    return this.currentPage() > 1;
  }

  get hasNext(): boolean {
    return this.currentPage() < this.totalPages;
  }

  get showPagination(): boolean {
    return this.totalPages > 1;
  }
}
