import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BudgetsService } from '../../../../services/budgets.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../../../environments/environment';
import { UsersService } from '../../../../services/users.service';
import { StatusComponent } from '../../../../components/status/status.component';
import swal from 'sweetalert2';

//declare a variable to save the budgets
let savedBudgets: any;

@Component({
  selector: 'app-list-budgets',
  standalone: true,
  imports: [NgxPaginationModule, CommonModule, FormsModule, StatusComponent],
  templateUrl: './list-budgets.component.html',
  styleUrls: ['./list-budgets.component.css']
})
export class ListBudgetsComponent implements OnInit {
  metalicasUser: any;
  SessionFilters: any;
  role: any;
  budgets: any[] = [];
  originalBudgets: any[] = []; // Nueva variable para almacenar los presupuestos originales
  page: number = 1;
  itemsPerPage: number = 50;
  totalPages: number = 1;
  filterText: string = ''; // Propiedad para el filtro de texto
  isProduction: boolean = environment.production;
  selectedUser: any = "";
  users: any[] = [];

  constructor(private budgetService: BudgetsService, private router: Router, private userService: UsersService) {
    this.metalicasUser = window.localStorage.getItem('metalicas-user');
    this.role = window.localStorage.getItem('role');
  }

  ngOnInit(): void {
    this.loadBudgets();
    this.getSessionFilters();
  }

  loadBudgets(): void {
    this.budgetService.getBudgets().subscribe(
      (budgets: any) => {
        this.budgets = budgets;
        this.originalBudgets = [...budgets]; // Guardar los datos originales al cargar
        this.getUsers();
        this.calculateTotalPages();
      },
      (error: any) => console.error('Error loading budgets', error)
    );
  }

  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.filteredBudgets.length / this.itemsPerPage);
  }

  viewBudget(code: number): void {
    console.log("isProduction", this.isProduction);
    if (this.isProduction) {
      window.open(`https://metalicasmundialltda.com/cotizaciones/admin/generate-pdf/` + code, '_blank');
    } else {
      window.open(`http://metalicas.test/generate-pdf/` + code, '_blank');
    }
  }

  editBudget(id: number): void {
    this.router.navigate([`/cotizaciones-actualizar/${id}`]);
  }

  addBudget(): void {
    this.router.navigate([`/cotizaciones-generar`]);
  }





  // Propiedad calculada para obtener presupuestos filtrados
  get filteredBudgets(): any[] {
    this.setSessionFilters();

    let filtered = [...this.originalBudgets]; // Usar los datos originales como base

    // Aplicar filtro de usuario
    if (this.selectedUser) {
      filtered = filtered.filter(budget => budget.code.includes(this.selectedUser));
    }

    // Aplicar filtro de texto
    if (this.filterText.trim()) {
      const filter = this.filterText.toLowerCase();
      filtered = filtered.filter(budget =>
        budget.code.toLowerCase().includes(filter) ||
        budget.client_name.toLowerCase().includes(filter) ||
        budget.project_name.toLowerCase().includes(filter)
      );
    }

    return filtered;
  }

  // this.users se saca de el servicio de usuarios
  getUsers(): void {
    this.userService.getUsers().subscribe(
      (users: any) => {
        this.users = users;
        console.log("users", this.users);
      },
      (error: any) => console.error('Error cargando users', error)
    );
  }

  // Hay que setear los filteredBudgets con las inicialies de usuario
  filterByUser(): void {
    // Si existe savedBudgets, this.budgets = savedBudgets
    if (typeof savedBudgets !== 'undefined') {
      this.budgets = savedBudgets;
    }

    const budgets = this.budgets;
    savedBudgets = this.budgets;
    this.budgets = budgets.filter(budget => budget.code.includes(this.selectedUser));

    this.calculateTotalPages();
    this.setSessionFilters();
  }

  onlyMyBudgets(): void {
    this.budgets = this.budgets.filter(budget => budget.user_id == this.metalicasUser.id);
  }

  getSessionFilters(): void {
    this.SessionFilters = window.localStorage.getItem('filters');
    if (this.SessionFilters) {
      const filters = JSON.parse(this.SessionFilters);
      this.filterText = filters.filterText;
      this.selectedUser = filters.selectedUser;
    }
  }

  //función para guardar los filtros en el local storage paginas, usuarios, texto
  setSessionFilters(): void {
    window.localStorage.setItem('filters', JSON.stringify({
      filterText: this.filterText,
      selectedUser: this.selectedUser
    }));
  }
}
