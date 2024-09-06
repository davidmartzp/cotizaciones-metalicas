<!DOCTYPE html>
<html>

<head>
    <style>
        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
        }

        td {
            border: 1px solid #000;
            padding: 5px;
        }

        .fw-bold {
            font-weight: bold;
        }

        p {
            font-size: 10px;
            margin: 9px;
        }


        @page{ margin:5px; }

    </style>
</head>

<body>

    <table>
        <tbody>
            <tr>
                <td colspan="3" style="text-align: center; width: 100% ">
                    <div>
                         <img src="{{ url('public/images/LOGO.jpg') }}" width="150px" > 
                    </div>
                    <div>
                        <p style="">NIT: 8002541071 Km 1.5<br> Via Cavasa Cali - Juanchito <a
                                href="www.metalicasmundial.com">www.metalicasmundial.com</a> Tel. +57 2 4359103 -
                            4359112 </p>
                    </div>
                </td>
                <td colspan="5">
                    <small style=" float: right;"> FM-GCC-001</small>
                    <table>
                        <tbody>
                            <tr>
                                <td colspan="3" style="text-align: center ; background-color: #C0C0C0">COTIZACION</td>
                            </tr>
                            <tr>
                                <td>N°</td>
                                <td>{{ $budget->code }}</td>
                                <td>Fecha: {{ $budget->project_date }}</td>
                            </tr>
                            <tr>
                                <td>Contacto:</td>
                                <td colspan="2" style="text-transform: uppercase">{{ $user->name }}</td>
                            </tr>
                            <tr>
                                <td>Teléfono:</td>
                                <td colspan="2">{{ $user->phone }}</td>
                            </tr>
                            <tr>
                                <td>Email:</td>
                                <td colspan="2">{{ $user->email }}</td>
                            </tr>
                        </tbody>
                    </table>

                </td>

            </tr>

            <tr>
                <td colspan="1">Señor/es:</td>
                <td colspan="2">{{ $budget->client_name }}</td>
                <td colspan="1">Identificación:</td>
                <td colspan="1">{{ $budget->client_numid }}</td>
                <td colspan="1">Email:</td>
                <td colspan="2" style="font-size: 9px">{{ $budget->client_email }}</td>
            </tr>
            <tr>
                <td colspan="1">Compañía:</td>
                <td colspan="2">{{ $budget->client_company }}</td>
                <td colspan="1">Teléfono:</td>
                <td colspan="1">{{ $budget->client_phone }}</td>
                
                <td colspan="1">Proyecto:</td>
                <td colspan="2" style="color: red ; text-transform: uppercase;">{{ $budget->project_name }}</td>
            </tr>
            <tr>
                <td colspan="1">Ciudad:</td>
                <td colspan="2">{{ $budget->client_city }}</td>
                <td colspan="1">Dirección:</td>
                <td colspan="4">{{ $budget->client_address }}</td>
            </tr>
            <tr>
                <td colspan="8">
                    En respuesta a su interés en los productos fabricados en nuestra Compañía, nos permitimos darle a
                    conocer nuestra siguiente oferta:
                </td>
            </tr>
            <tr>
                <td colspan="8">
                    <table>
                        <tbody>
                            <tr style="font-size: 9px; ">
                                <td class=" fw-bold" style="width: 5%; ">ITEM</td>
                                <td class="fw-bold" style="width: 30%;">DESCRIPCIÓN</td>
                                <td class=" fw-bold" style="width: 5%; ">UNIDAD</td>
                                <td class=" fw-bold" style="width: 10%; ">CANT</td>
                                <td class=" fw-bold" style="width: 10%; ">VALOR UND</td>
                                <td class=" fw-bold" style="width: 20%; ">VALOR TOTAL</td>
                                <td class="fw-bold" style="width: 20%;">PRODUCTO</td>
                            </tr>
                            @foreach($products as $product)
                                <tr>
                                    <td style="width: 5%;">{{ $loop->iteration }}</td>
                                    <td style="width: 30%;">
                                        <p class="m-0">{{ $product->description }}</p>
                                    </td>
                                    <td style="width: 5%;">{{ $product->unit }}</td>
                                    <td style="width: 10%;">{{ fmod($quantity = round($product->quantity, 1), 1) == 0.0 ? (int)$quantity : number_format($quantity, 1, ',', '') }}
</td>
                                    <td style="width: 10%;">
                                        <?php echo $budget->currency =='1' ? '$':'USD ' ?> {{  number_format($product->price, 0, '', '.') }}
                                        @if($product->apply_max_discount)
                                            Dto.({{ $product->max_discount }}%)
                                        @endif
                                        @if($product->apply_other_discount)
                                            Dto.({{ $product->other_discount }}%)
                                        @endif
                                    </td>
                                    <td style="width: 20%;"><?php echo $budget->currency =='1' ? '$':'USD ' ?>{{ number_format($product->subtotal, 0, '', '.') }}</td>


                                    <td style="width: 20%;">
                                        @if($product->image)
                                          <img src="{{ url('public/images/' . $product->image) }}" width="150px" alt="{{ $product->name }}">
                                        @endif
                                    </td>
                                </tr>

                                <tr>
                                    <td style="width: 10%;" colspan="4"></td>
                                    <td style="width: 10%;">IVA 19%</td>
                                    <td style="width: 20%;"><?php echo $budget->currency =='1' ? '$':'USD ' ?>{{ number_format($product->iva, 0, '', '.') }} </td>
                                    <td style="width: 20%;"></td>
                                </tr>
                            @endforeach
                            <tr>
                                <td style="width: 10%; " colspan="3"></td>
                                <td style="width: 10%; " colspan="2">VALOR SUMINISTROS</td>
                                <td style="width: 20%; "><?php echo $budget->currency =='1' ? '$':'USD ' ?>{{number_format($budget->total_supplies, 0, '', '.')  }}</td>
                                <td style="width: 20%; "></td>
                            </tr>

                        </tbody>
                    </table>
                </td>
            </tr>
            @if(count($services) > 0)

                <tr>
                    <td colspan="8">
                        <table>
                            <tbody>
                                <tr style="font-size: 9px; ">
                                    <td class=" fw-bold" style="width: 5%; ">ITEM</td>
                                    <td class="fw-bold" style="width: 30%;">DESCRIPCIÓN</td>
                                    <td class=" fw-bold" style="width: 5%; ">UNIDAD</td>
                                    <td class=" fw-bold" style="width: 10%; ">CANT</td>
                                    <td class=" fw-bold" style="width: 10%; ">VALOR UND</td>
                                    <td class=" fw-bold" style="width: 20%; ">VALOR TOTAL</td>

                                </tr>
                                @foreach($services as $service)

                                    <tr>
                                        <td style="width: 5%; ">0</td>
                                        <td style="width: 30%; ">
                                            <p class="m-0" style="font-size : 14px">{{ $service->description }}</p>
                                        </td>
                                        <td style="width: 5%; ">{{ $service->unit }}</td>
                                    <td style="width: 10%;">{{ fmod($s_quantity = round($service->quantity, 1), 1) == 0.0 ? (int)$s_quantity : number_format($s_quantity, 1, ',', '') }}</td>
                                        <td style="width: 10%; "><?php echo $budget->currency =='1' ? '$':'USD ' ?>{{  number_format($service->price, 0, '', '.') }}</td>
                                        <td style="width: 20%; "><?php echo $budget->currency =='1' ? '$':'USD ' ?>{{  number_format($service->subtotal, 0, '', '.') }}</td>

                                    </tr>
                                    <tr>
                                        <td style="width: 40%; " colspan="3"></td>
                                        <td style="width: 10%; ">(A)</td>
                                        <td style="width: 10%; ">{{ $service->adminPercentage }}</td>
                                        <td style="width: 20%; "><?php echo $budget->currency =='1' ? '$':'USD ' ?>{{  number_format($service->adminValue, 0, '', '.') }}</td>
                                    </tr>
                                    <tr>
                                        <td style="width: 40%; " colspan="3"></td>
                                        <td style="width: 10%; ">(I)</td>
                                        <td style="width: 10%; ">{{ $service->unforeseenPercentage }}</td>
                                        <td style="width: 20%; "><?php echo $budget->currency =='1' ? '$':'USD ' ?>{{  number_format($service->unforeseenValue, 0, '', '.') }}</td>
                                    </tr>
                                    <tr>
                                        <td style="width: 40%; " colspan="3"></td>
                                        <td style="width: 10%; ">(U)</td>
                                        <td style="width: 10%; ">{{ $service->profitPercentage }}</td>
                                        <td style="width: 20%; "><?php echo $budget->currency =='1' ? '$':'USD ' ?>{{  number_format($service->profitValue, 0, '', '.') }}</td>
                                    </tr>
                                    <tr>
                                        <td style="width: 10%; " colspan="4"></td>
                                        <td style="width: 10%; ">IVA 19%</td>
                                        <td style="width: 20%; "><?php echo $budget->currency =='1' ? '$':'USD ' ?>{{  number_format($service->iva, 0, '', '.') }}</td>
                                    </tr>
                                @endforeach

                                <tr>
                                    <td style="width: 10%; " colspan="3"></td>
                                    <td style="width: 10%; " colspan="2">VALOR INSTALACIÓN</td>
                                    <td style="width: 20%; "><?php echo $budget->currency =='1' ? '$':'USD ' ?>{{  number_format($budget->total_services, 0, '', '.') }}</td>
                                </tr>

                            </tbody>
                        </table>
                    </td>
                </tr>
            @endif
            <tr>
                <td colspan="8" style="font-size: 12px; line-height: 0.8; margin-left: 10px;">
                    <p>OBSERVACIONES:</p>
                    <!--si los campos observation_n tienen valor si se muestran-->
                    <p style="margin-left: 25px;"><?php echo $budget->observation_1  == 'si' ? '':'NO' ?> INCLUYE
                        VISITAS PARA TOMA DE MEDIDAS EN SITIO.</p>
                    <p style="margin-left: 25px;"><?php echo $budget->observation_2  == 'si' ? '':'NO' ?> INCLUYE
                        INSTALACION</p>
                    <p style="margin-left: 25px;"><?php echo $budget->observation_3  == 'si' ? '':'NO' ?> INCLUYE
                        COORDINADOR DE ALTURAS Y OFICIAL EN ALTURAS</p>
                    <p style="margin-left: 25px;"><?php echo $budget->observation_4  == 'si' ? '':'NO' ?> INCLUYE SISO
                    </p>
                    
                    <p style="margin-left: 25px;">NO INCLUYE TRABAJOS DE MAMPOSTERIA, DE OBRA CIVIL, O VIDRIO</p>
                    <p style="margin-left: 25px;">NO INCLUYE TRABAJO NOCTURNO O DOMINICAL</p>
                    <p style="margin-left: 25px;">CUMPLIMOS CON TODOS LOS PROTOCOLOS DE SALUD Y SEGURIDAD EN EL TRABAJO
                        LEGALMENTE VIGENTES</p>
                    <p style="margin-left: 25px;">EL VALOR DE LA INSTALACION ESTA SUJETO A LA CANTIDAD DE METROS
                        CONTRATADOS, LA DISMINUCION PODRIA AFECTAR EL VALOR OFERTADO.</p>
                    <p style="margin-left: 25px;">EL VALOR FINAL DEL CONTRATO SERA CALCULADO DE ACUERDO CON LOS MEROS
                        REALES INSTALADOS EN OBRA</p>
                    <p style="margin-left: 25px;">COLOR A ESCOGER SEGÚN DISPONIBILIDAD</p>
                </td>
            </tr>
            @if($budget->observation)
            <tr>
                <td colspan="8">
                    <p>OTRAS OBSERVACIONES:</p>
                    <p style="margin-left: 25px;text-transform: uppercase">{{ $budget->observation }}</p>
                </td>
            </tr>
            @endif
            <tr>
                <td colspan="3">COSTOS DE TRANSPORTE</td>
                <td colspan="5"><?php echo $budget->currency =='1' ? '$':'USD ' ?>{{ $budget->delivery_cost }}</td>
            </tr>
            <tr>
                <td colspan="3">TOTAL COTIZADO</td>
                <td colspan="5" style="color: red"><?php echo $budget->currency =='1' ? '$':'USD ' ?>{{ number_format($budget->total + $budget->delivery_cost, 0, '', '.') }}</td>
            </tr>
            <tr>
                <td colspan="3">ANTICIPO <?php echo $budget->delivery_cost > 0  ? '+ COSTOS DE TRANSPORTE':'' ?></td>
                <td colspan="5" style="color: red">{{ number_format($budget->advance_payment_percentage, 0, '', '.') }}% |
                <?php echo $budget->currency =='1' ? '$':'USD ' ?>{{number_format($budget->advance_payment_value + $budget->delivery_cost, 0, '', '.')}}</td>
            </tr>
            <tr>
                <td colspan="3">GARANTÍA</td>
                <td colspan="5">{{ $budget->warranty }}</td>
            </tr>
            <tr>
                <td colspan="3">VALIDEZ DE LA OFERTA</td>
                <td colspan="5">Hasta: {{ $budget->offer_valid }}</td>
            </tr>
            <tr>
                <td colspan="8">
                    <p>Agradecemos su atención a la presente y quedamos en espera de sus requerimientos.</p>
                </td>
            </tr>
            <tr>
                <td colspan="8">
                    <p>Cordialmente, </p>
                    <p style="text-transform: uppercase">{{ $user->name }}</p>
                    <p>METÁLICAS MUNDIAL LTDA.</p>
                    <p>Para mayor información acerca del portafolio de productos ofrecidos por nuestra Compañía le
                        invitamos a consultar nuestra página web: <a
                            href="www.metalicasmundial.com">www.metalicasmundial.com</a> </p>
                </td>
            </tr>
        </tbody>
    </table>
</body>

</html>
