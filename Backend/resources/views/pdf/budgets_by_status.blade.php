<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Reporte de Cotizaciones por Estado</title>
    <style>
        body { font-family: Arial, sans-serif; }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            font-size: 12px;
        }
        table, th, td {
            border: 1px solid black;
        }
        th, td {
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
        .status-label {
            padding: 5px;
            border-radius: 5px;
            color: white;
        }
    </style>
</head>
<body>

    <h2>Reporte de Cotizaciones por Estado</h2>
    <p>Fecha de reporte: {{ \Carbon\Carbon::now()->format('d/m/Y') }}</p>
    <p>Rango de fechas: {{ \Carbon\Carbon::parse($start_date)->format('d/m/Y') }} - {{ \Carbon\Carbon::parse($end_date)->format('d/m/Y') }}</p>


    <h3>Totales por Estado</h3>
    <table>
        <thead>
            <tr>
                <th>Estado</th>
                <th>Total Pesos</th>
                <th>Total Dólares</th>
            </tr>
        </thead>
        <tbody>
            
            @if($totalsByStatus->isNotEmpty())
                @foreach($statuses as $status => $info)
                    <tr>
                        <td>
                            <span class="status-label" style="background-color: {{ $info['color'] }}">
                                {{ $info['description'] }}
                            </span>
                        </td>
                        <td>{{ number_format($totalsByStatus->get($status)['total_cop'] ?? 0, 2) }}</td>
                        <td>{{ number_format($totalsByStatus->get($status)['total_usd'] ?? 0, 2) }}</td>
                    </tr>
                @endforeach
            @else
                <tr>
                    <td colspan="3">No hay resultados</td>
                </tr>
            @endif
        </tbody>
    </table>

    <h3>Detalles de Cotizaciones</h3>
    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Código</th>
                <th>Cliente</th>
                <th>Proyecto</th>
                <th>Vendedor</th>
                <th>Fecha</th>
                <th>Total Pesos</th>
                <th>Total Dólares</th>

                <th>Estado</th>
            </tr>
        </thead>
        <tbody>
            @if($budgets->isNotEmpty())
                @foreach($budgets as $budget)
                    <tr>
                        <td>{{ $loop->iteration }}</td>
                        <td>{{ $budget->code }}</td>
                        <td>{{ $budget->client_name }}</td>
                        <td>{{ $budget->project_name }}</td>
                        <td>{{ $budget->user->name}}</td>
                        <td>{{ \Carbon\Carbon::parse($budget->project_date)->format('d/m/Y') }}</td>
                        <td>
                            @if($budget->currency == 1)
                                ${{ number_format($budget->total, 2) }}
                            @else
                                $0.00
                            @endif
                        </td>
                        <td>
                            @if($budget->currency == 2)
                                ${{ number_format($budget->total, 2) }}
                            @else
                                $0.00
                            @endif
                        </td>
                        <td>
                            <span class="status-label" style="background-color: {{ $statuses[$budget->status]['color'] }}">
                                {{ $statuses[$budget->status]['description'] }}
                            </span>
                        </td>
                    </tr>
                @endforeach
            @else
                <tr>
                    <td colspan="6">No hay resultados</td>
                </tr>
            @endif
        </tbody>
    </table>

</body>
</html>
