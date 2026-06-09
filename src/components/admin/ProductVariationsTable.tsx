"use client";

import { useFieldArray, Control, UseFormRegister } from "react-hook-form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash, Plus, ImageIcon, X } from "lucide-react";
import { MediaLibrary } from "./MediaLibrary";
import { useState } from "react";
import Image from "next/image";

interface ProductVariationsTableProps {
    control: Control<any>;
    register: UseFormRegister<any>;
}

export function ProductVariationsTable({ control, register }: ProductVariationsTableProps) {
    const { fields: variationFields, append: appendVar, remove: removeVar, update: updateVar } = useFieldArray({
        control,
        name: "variations"
    });

    const [mediaLibOpen, setMediaLibOpen] = useState<number | null>(null);

    const addVariation = () => {
        appendVar({
            attributes: [{ key: "Color", value: "" }, { key: "Size", value: "" }],
            price: 0,
            stock_quantity: 10,
            image_url: ""
        });
    };

    return (
        <div className="space-y-4 border rounded-md p-4 bg-background">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Product Variations</h3>
                <Button type="button" onClick={addVariation} size="sm">
                    <Plus className="h-4 w-4 mr-2" /> Add Variation
                </Button>
            </div>

            <div className="rounded-md border overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            <TableHead className="w-[80px]">Image</TableHead>
                            <TableHead className="min-w-[300px]">Attributes</TableHead>
                            <TableHead className="w-[150px]">Price (Override)</TableHead>
                            <TableHead className="w-[200px] min-w-[200px]">Stock</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {variationFields.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                    No variations added. Create one to start.
                                </TableCell>
                            </TableRow>
                        )}
                        {variationFields.map((field, index) => (
                            <VariationRow
                                key={field.id}
                                index={index}
                                field={field}
                                register={register}
                                control={control}
                                remove={removeVar}
                                onImageClick={() => setMediaLibOpen(index)}
                            />
                        ))}
                    </TableBody>
                </Table>
            </div>

            <MediaLibrary
                open={mediaLibOpen !== null}
                onOpenChange={(open) => !open && setMediaLibOpen(null)}
                onSelect={(url) => {
                    if (mediaLibOpen !== null) {
                        updateVar(mediaLibOpen, { ...variationFields[mediaLibOpen], image_url: url });
                        setMediaLibOpen(null);
                    }
                }}
            />
        </div>
    );
}

// Sub-component for Row to handle its own Attributes Field Array cleanly
function VariationRow({ index, field, register, control, remove, onImageClick }: any) {
    const { fields: attrFields, append: appendAttr, remove: removeAttr } = useFieldArray({
        control,
        name: `variations.${index}.attributes`
    });

    return (
        <TableRow>
            <TableCell>
                <div className="relative h-12 w-12 border rounded bg-muted flex items-center justify-center cursor-pointer group hover:border-primary transition-colors bg-white"
                    onClick={onImageClick}>
                    {(field as any).image_url ? (
                        <Image src={(field as any).image_url} alt="Var" fill className="object-cover rounded" />
                    ) : (
                        <ImageIcon className="h-5 w-5 text-muted-foreground" />
                    )}
                    {/* Hidden Input for generic image binding if needed, but we used updateVar */}
                </div>
            </TableCell>

            <TableCell>
                <div className="flex flex-col gap-2">
                    {attrFields.map((attr, attrIndex) => (
                        <div key={attr.id} className="flex items-center gap-2">
                            <div className="flex items-center border rounded-md overflow-hidden bg-background focus-within:ring-1 focus-within:ring-primary">
                                {/* Use a datalist or Select for Key suggestions? Simple Input with suggestions is easy */}
                                <Input
                                    {...register(`variations.${index}.attributes.${attrIndex}.key`)}
                                    className="w-24 border-0 h-10 rounded-none text-right px-2 font-medium bg-muted/20 focus-visible:ring-0"
                                    placeholder="Key"
                                    list="attr-keys"
                                />
                                <div className="h-10 w-[1px] bg-border mx-0"></div>
                                <Input
                                    {...register(`variations.${index}.attributes.${attrIndex}.value`)}
                                    className="w-32 border-0 h-10 rounded-none px-2 focus-visible:ring-0"
                                    placeholder="Value"
                                />
                            </div>
                            <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => removeAttr(attrIndex)}>
                                <X className="h-3 w-3" />
                            </Button>
                        </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" className="h-7 text-xs w-fit" onClick={() => appendAttr({ key: "", value: "" })}>
                        + Attr
                    </Button>
                    <datalist id="attr-keys">
                        <option value="Color" />
                        <option value="Size" />
                        <option value="Material" />
                        <option value="Style" />
                    </datalist>
                </div>
            </TableCell>

            <TableCell>
                <Input type="number" {...register(`variations.${index}.price`)} className="h-10 w-full" step="0.01" />
            </TableCell>
            <TableCell>
                <Input type="number" {...register(`variations.${index}.stock_quantity`)} className="h-10 w-full min-w-[120px]" />
            </TableCell>
            <TableCell>
                <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                    <Trash className="h-4 w-4 text-destructive" />
                </Button>
            </TableCell>
        </TableRow>
    );
}
