import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BudgetsService } from '../../../../services/budgets.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-list-budgets',
  standalone: true,
  imports: [NgxPaginationModule, CommonModule, FormsModule],
  templateUrl: './list-budgets.component.html',
  styleUrls: ['./list-budgets.component.css']
})
export class ListBudgetsComponent implements OnInit {
  budgets: any[] = [];
  page: number = 1;
  itemsPerPage: number = 50;
  totalPages: number = 1;
  filterText: string = ''; // Propiedad para el filtro de texto
  isProduction: boolean = environment.production;

  constructor(private budgetService: BudgetsService, private router: Router) { 
    

  }

  ngOnInit(): void {
    this.loadBudgets();
  }

  loadBudgets(): void {
    this.budgetService.getBudgets().subscribe(
      (budgets: any) => {
        this.budgets = budgets;
        this.calculateTotalPages
      },
      (error: any) => console.error('Error loading budgets', error)
    );
  }

  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.filteredBudgets.length / this.itemsPerPage);
  }

  viewBudget(code: number): void {
    console.log("isProduction", this.isProduction);
    if(this.isProduction){
      window.open(`https://metalicasmundialltda.com/cotizaciones/admin/generate-pdf/` + code, '_blank');
    }else{
      window.open(`http://metalicas.test/generate-pdf/` + code, '_blank');
    }
   
  }

  editBudget(id: number): void {
    this.router.navigate([`/cotizaciones-actualizar/${id}`]);
  }

  addBudget(): void {
    this.router.navigate([`/cotizaciones-generar`]);
  }

  deleteBudget(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este presupuesto?')) {
      this.budgetService.deleteBudget(id).subscribe(
        () => this.loadBudgets(),
        (error: any) => console.error('Error deleting budget', error)
      );
    }
  }

  // Propiedad calculada para obtener presupuestos filtrados
  get filteredBudgets(): any[] {
    if (!this.filterText.trim()) {
      return this.budgets;
    }
    const filter = this.filterText.toLowerCase();
    return this.budgets.filter(budget => 
      budget.code.toLowerCase().includes(filter) ||
      budget.client_name.toLowerCase().includes(filter) ||
      budget.project_name.toLowerCase().includes(filter)
    );
  }
}
