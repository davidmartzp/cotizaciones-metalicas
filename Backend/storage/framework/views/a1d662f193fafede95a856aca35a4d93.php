<!DOCTYPE html>
<html>

<head>
    <style>
        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
            margin-top: 5px;
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
                        <img src="<?php echo e(url('public/images/LOGO.jpg')); ?>" width="150px">
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
                                <td><?php echo e($budget->code); ?></td>
                                <td>Fecha: <?php echo e($budget->project_date); ?></td>
                            </tr>
                            <tr>
                                <td>Contacto:</td>
                                <td colspan="2" style="text-transform: uppercase"><?php echo e($user->name); ?></td>
                            </tr>
                            <tr>
                                <td>Teléfono:</td>
                                <td colspan="2"><?php echo e($user->phone); ?></td>
                            </tr>
                            <tr>
                                <td>Email:</td>
                                <td colspan="2"><?php echo e($user->email); ?></td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        </tbody>
    </table>

    <table>
        <tbody>
            <tr>
                <td colspan="1">Señor/es:</td>
                <td colspan="2"><?php echo e($budget->client_name); ?></td>
                <td colspan="1">Identificación:</td>
                <td colspan="1"><?php echo e($budget->client_numid); ?></td>
                <td colspan="1">Email:</td>
                <td colspan="2" style="font-size: 9px"><?php echo e($budget->client_email); ?></td>
            </tr>
            <tr>
                <td colspan="1">Compañía:</td>
                <td colspan="2"><?php echo e($budget->client_company); ?></td>
                <td colspan="1">Teléfono:</td>
                <td colspan="1"><?php echo e($budget->client_phone); ?></td>
                <td colspan="1">Proyecto:</td>
                <td colspan="2" style="color: red ; text-transform: uppercase;"><?php echo e($budget->project_name); ?></td>
            </tr>
            <tr>
                <td colspan="1">Ciudad:</td>
                <td colspan="2"><?php echo e($budget->client_city); ?></td>
                <td colspan="1">Dirección:</td>
                <td colspan="4"><?php echo e($budget->client_address); ?></td>
            </tr>
            <tr>
                <td colspan="8">
                    En respuesta a su interés en los productos fabricados en nuestra Compañía, nos permitimos darle a
                    conocer nuestra siguiente oferta:
                </td>
            </tr>
        </tbody>
    </table>

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
            <?php $__currentLoopData = $products; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $product): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                <tr>
                    <td style="width: 5%;"><?php echo e($product->code_iva); ?></td>
                    <td style="width: 30%;">
                        <p class="m-0" style="font-size: 14px"><?php echo e($product->description); ?></p>
                    </td>
                    <td style="width: 5%;"><?php echo e($product->unit); ?></td>
                    <td style="width: 10%;">
                        <?php echo e(fmod($quantity = round($product->quantity, 1), 1) == 0.0 ? (int)$quantity : number_format($quantity, 1, ',', '')); ?>

                    </td>
                    <td style="width: 10%;">
                        <?php echo $budget->currency =='1' ? '$':'USD ' ?>
                        <?php echo e(number_format($product->price, 0, '', '.')); ?>

                        <?php if($product->apply_max_discount): ?>
                            Dto.(<?php echo e($product->max_discount); ?>%)
                        <?php endif; ?>
                        <?php if($product->apply_other_discount): ?>
                            Dto.(<?php echo e($product->other_discount); ?>%)
                        <?php endif; ?>
                    </td>
                    <td style="width: 20%;">
                        <?php echo $budget->currency =='1' ? '$':'USD ' ?><?php echo e(number_format($product->subtotal, 0, '', '.')); ?>

                    </td>
                    <td style="width: 20%;">
                        <?php if($product->image): ?>
                            <img src="<?php echo e(url('public/images/' . $product->image)); ?>"
                                width="150px" alt="<?php echo e($product->name); ?>">
                        <?php endif; ?>
                    </td>
                </tr>
            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
            <tr>
                <td style="width: 10%;" colspan="4"></td>
                <td style="width: 10%;">FLETE</td>
                <td style="width: 20%;">
                    <?php echo $budget->currency =='1' ? '$':'USD ' ?><?php echo e(number_format($budget->delivery_cost, 0, '', '.')); ?>

                </td>
                <td style="width: 20%;"></td>
            </tr>
            <tr>
                <td style="width: 10%;" colspan="4"></td>
                <td style="width: 10%;">SUBTOTAL</td>
                <td style="width: 20%;">
                    <?php echo $budget->currency =='1' ? '$':'USD ' ?><?php echo e(number_format($subtotal_products, 0, '', '.')); ?>

                </td>
                <td style="width: 20%;"></td>
            </tr>
            <tr>
                <td style="width: 10%;" colspan="4"></td>
                <td style="width: 10%;">IVA 19%</td>
                <td style="width: 20%;">
                    <?php echo $budget->currency =='1' ? '$':'USD ' ?><?php echo e(number_format($budget->suppliesIva, 0, '', '.')); ?>

                </td>
                <td style="width: 20%;"></td>
            </tr>
            <tr>
                <td style="width: 10%; " colspan="3"></td>
                <td style="width: 10%; " colspan="2">VALOR SUMINISTROS</td>
                <td style="width: 20%; ">
                    <?php echo $budget->currency =='1' ? '$':'USD ' ?><?php echo e(number_format($budget->total_supplies, 0, '', '.')); ?>

                </td>
                <td style="width: 20%; "></td>
            </tr>
        </tbody>
    </table>

    <?php if(count($services) > 0): ?>
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
                <?php $__currentLoopData = $services; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $service): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                    <tr>
                        <td style="width: 5%; "><?php echo e($loop->iteration); ?></td>
                        <td style="width: 30%; ">
                            <p class="m-0" style="font-size : 14px"><?php echo e($service->description); ?></p>
                        </td>
                        <td style="width: 5%; "><?php echo e($service->unit); ?></td>
                        <td style="width: 10%;">
                            <?php echo e(number_format($service->quantity, 2, ',', '.')); ?>

                        </td>
                        <td style="width: 10%; ">
                            <?php echo $budget->currency =='1' ? '$':'USD ' ?><?php echo e(number_format($service->price, 0, '', '.')); ?>

                        </td>
                        <td style="width: 20%; ">
                            <?php echo $budget->currency =='1' ? '$':'USD ' ?><?php echo e(number_format($service->subtotal, 0, '', '.')); ?>

                        </td>
                    </tr>
                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                <tr>
                    <td style="width: 40%; " colspan="3"></td>
                    <td style="width: 10%; "></td>
                    <td style="width: 10%; ">
                        SUBTOTAL
                    </td>
                    <td style="width: 20%; ">
                        <?php echo $budget->currency =='1' ? '$':'USD ' ?><?php echo e(number_format($subtotal_services, 0, '', '.')); ?>

                    </td>
                </tr>
                <tr>
                    <td style="width: 40%; " colspan="3"></td>
                    <td style="width: 10%; ">(A)</td>
                    <td style="width: 10%; ">
                        <?php echo e(number_format($budget->adminPercentage, 0, '', '.')); ?>%
                    </td>
                    <td style="width: 20%; ">
                        <?php echo $budget->currency =='1' ? '$':'USD ' ?><?php echo e(number_format($budget->adminValue, 0, '', '.')); ?>

                    </td>
                </tr>
                <tr>
                    <td style="width: 40%; " colspan="3"></td>
                    <td style="width: 10%; ">(I)</td>
                    <td style="width: 10%; ">
                        <?php echo e(number_format($budget->unforeseenPercentage, 0, '', '.')); ?>%
                    </td>
                    <td style="width: 20%; ">
                        <?php echo $budget->currency =='1' ? '$':'USD ' ?><?php echo e(number_format($budget->unforeseenValue, 0, '', '.')); ?>

                    </td>
                </tr>
                <tr>
                    <td style="width: 40%; " colspan="3"></td>
                    <td style="width: 10%; ">(U)</td>
                    <td style="width: 10%; ">
                        <?php echo e(number_format($budget->profitPercentage, 0, '', '.')); ?>%
                    </td>
                    <td style="width: 20%; ">
                        <?php echo $budget->currency =='1' ? '$':'USD ' ?><?php echo e(number_format($budget->profitValue, 0, '', '.')); ?>

                    </td>
                </tr>
                <tr>
                    <td style="width: 10%; " colspan="4"></td>
                    <td style="width: 10%; ">IVA 19%</td>
                    <td style="width: 20%; ">
                        <?php echo $budget->currency =='1' ? '$':'USD ' ?><?php echo e(number_format($budget->servicesIva, 0, '', '.')); ?>

                    </td>
                </tr>
                <tr>
                    <td style="width: 10%; " colspan="3"></td>
                    <td style="width: 10%; " colspan="2">VALOR INSTALACIÓN</td>
                    <td style="width: 20%; ">
                        <?php echo $budget->currency =='1' ? '$':'USD ' ?><?php echo e(number_format($budget->total_services, 0, '', '.')); ?>

                    </td>
                </tr>
            </tbody>
        </table>
    <?php endif; ?>

    <?php if(count($observations) > 0): ?>
        <table>
            <tbody>
                <tr>
                    <td colspan="8" style="font-size: 12px; line-height: 0.8; margin-left: 10px;">
                        <p>OBSERVACIONES:</p>
                        <!--si los campos observation_n tienen valor si se muestran-->
                        <?php $__currentLoopData = $observations; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $observation): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                            <?php if(Str::startsWith($observation->description, '*')): ?>
                                <p style="margin-left: 25px; text-transform: uppercase">
                                    <?php echo e(ltrim($observation->description, '*')); ?></p>
                            <?php else: ?>
                                <p style="margin-left: 25px; text-transform: uppercase"><?php echo e($observation->value); ?>

                                    <?php echo e($observation->description); ?></p>
                            <?php endif; ?>
                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                    </td>
                </tr>
            </tbody>
        </table>
    <?php endif; ?>

    <?php if($budget->observation): ?>
        <table>
            <tbody>
                <tr>
                    <td colspan="8">
                        <p>OTRAS OBSERVACIONES:</p>
                        <p style="margin-left: 25px;text-transform: uppercase"><?php echo e($budget->observation); ?></p>
                    </td>
                </tr>
            </tbody>
        </table>
    <?php endif; ?>

    <table>
        <tbody>
            <tr>
                <td colspan="3">TOTAL COTIZADO</td>
                <td colspan="5" style="color: red">
                    <?php echo $budget->currency =='1' ? '$':'USD ' ?><?php echo e(number_format($budget->total, 0, '', '.')); ?>

                </td>
            </tr>
            <?php if($budget->advance_payment_percentage > 0): ?>
                <tr>
                    <td colspan="3">ANTICIPO <?php echo $budget->delivery_cost > 0  ? '+ COSTOS DE TRANSPORTE':'' ?>
                    </td>
                    <td colspan="5" style="color: red">
                        <?php echo e(number_format($budget->advance_payment_percentage, 0, '', '.')); ?>%
                        |
                        <?php echo $budget->currency =='1' ? '$':'USD ' ?><?php echo e(number_format($budget->advance_payment_value, 0, '', '.')); ?>

                    </td>
                </tr>
            <?php endif; ?>
            <?php if($budget->delivery_address): ?>
                <tr>
                    <td colspan="3">LUGAR DE ENTREGA</td>
                    <td colspan="5">
                        <?php echo e($budget->delivery_address); ?>

                    </td>
                </tr>
            <?php endif; ?>
            <?php if($budget->manufacture_delivery_time): ?>
                <tr>
                    <td colspan="3">TIEMPO DE FABRICACIÓN</td>
                    <td colspan="5"><?php echo e($budget->manufacture_delivery_time); ?></td>
                </tr>
            <?php endif; ?>
            <?php if($budget->installation_delivery_time): ?>
                <tr>
                    <td colspan="3">TIEMPO DE INSTALACIÓN</td>
                    <td colspan="5"><?php echo e($budget->installation_delivery_time); ?></td>
                </tr>
            <?php endif; ?>
            <tr>
                <td colspan="3">GARANTÍA</td>
                <td colspan="5"><?php echo e($budget->warranty); ?></td>
            </tr>
            <tr>
                <td colspan="3">VALIDEZ DE LA OFERTA</td>
                <td colspan="5">Hasta: <?php echo e($budget->offer_valid); ?></td>
            </tr>
            <tr>
                <td colspan="8">
                    <p>Agradecemos su atención a la presente y quedamos en espera de sus requerimientos.</p>
                </td>
            </tr>
            <tr>
                <td colspan="8">
                    <p>Cordialmente, </p>
                    <p style="text-transform: uppercase"><?php echo e($user->name); ?></p>
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
<?php /**PATH /var/www/html/metalicas/Backend/resources/views/pdf/table.blade.php ENDPATH**/ ?>