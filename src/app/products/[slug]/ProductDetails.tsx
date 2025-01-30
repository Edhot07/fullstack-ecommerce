"use client"

import Badge from '@/components/ui/badge';
import WixImage from '@/components/WixImage';
import { products } from '@wix/stores';
import React, { useState } from 'react';
import ProductOptions from './ProductOptions';
import { checkInStock, findVariant } from '@/lib/utils';
import ProductPrice from './ProductPrice';
import ProductMedia from './ProductMedia';
import { Label } from '@radix-ui/react-label';
import { Input } from '@/components/ui/input';
import { InfoIcon } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import AddToCartButton from '@/components/AddToCartButton';
import BackInStockNotificationButton from '@/components/BackInStockNotificationButton';
interface ProductDetailsProps{
    product: products.Product;  // Assuming Product is a type from @wix/stores library. Replace with actual type when using this library.  // eslint-disable-line @typescript-eslint/no-explicit-any
  
}

const ProductDetails = ({product}: ProductDetailsProps) => {
    const [quantity, setQuantity] = useState(1);

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(
    product.productOptions?.map(option=>({
        [option.name || ""]: option.choices?.[0].description || "",
    }))
    ?.reduce((acc, curr)=>({...acc, ...curr}), {}) || {}
  )

  const selectedVariant = findVariant(product, selectedOptions);

  const inStock = checkInStock(product, selectedOptions);

  const availableQuantity = selectedVariant?.stock?.quantity ?? product.stock?.quantity;

  const availableQuantityExceeded = !!availableQuantity && quantity > availableQuantity;

  const selectedOptionsMedia = product.productOptions?.flatMap(option =>{
    const selectedChoice = option.choices?.find(
        choice=> choice.description === selectedOptions[option.name || ""]
    )
    return selectedChoice?.media?.items ?? [];
  })

  return (
    <div className='flex flex-col gap-10 md:flex-row lg:gap-20 '>
        {/* <div className='basis-2/5'>
            <WixImage
                mediaIdentifier={product.media?.mainMedia?.image?.url}
                alt={product.media?.mainMedia?.image?.altText}
                width={1000}
                height={1000}
                className='sticky top-0'

            />

        </div> */}
        {/* <ProductMedia media={product.media?.items}/> */}
        <ProductMedia media={!!selectedOptionsMedia?.length
            ? selectedOptionsMedia
            : product.media?.items
        }/>
        <div className='basis-3/5 space-y-5'>
            <div className='space-y-2.5'>
                <h1 className="text-3xl font-bold lg:text-4xl">{product.name}</h1>
                {product.brand && (
                    <div className='text-muted-foreground'>{product.brand}</div>
                )}
                {product.ribbon && (
                    <Badge className='block' >{product.ribbon}</Badge>
                )}
            </div>
            {product.description && (
                <div dangerouslySetInnerHTML={{__html: product.description}}
                //To edit this we have to enable the tailwindcss/typography on the tailwind.config.ts file: require("@tailwindcss/typography")
                className='prose dark:prose-invert'
                />
            )}
            <ProductPrice product={product} selectedVariant={selectedVariant} />
            <ProductOptions product={product} selectedOptions={selectedOptions} setSelectOptions={setSelectedOptions}/>
            <div>
                Selected Options:
                {JSON.stringify(selectedOptions)}
            </div>
            <div>
                Seclected Variant:
                {JSON.stringify(selectedVariant?.choices)}
            </div>
            <div className='space-y-1.5'>
                <Label htmlFor='quantity'>Quantity</Label>
                <div className='flex items-center gap-2.5 '>
                    <Input name='quantity'
                        type='number'
                        value={quantity}
                        onChange={e=>setQuantity(Number(e.target.value))}
                        className='w-24'
                        disabled={!inStock}
                        min={1}
                    />
                    {!!availableQuantity && (
                        availableQuantityExceeded || availableQuantity < 10
                    ) && (
                        <span className='text-destructive '>
                            Only {availableQuantity} items are left in stock
                        </span>
                    )}

                </div>

            </div>

            {inStock ? (
                <AddToCartButton
                    product={product}
                    selectedOptions={selectedOptions}
                    quantity={quantity}
                    disabled={availableQuantityExceeded || quantity < 1}
                    className="w-full"
                />
                
            ):(
                <BackInStockNotificationButton product={product} selectedOptions={selectedOptions} className='w-full'/>
            )}
            {!!product.additionalInfoSections?.length && (
                <div className='space-y-1.5 text-sm text-muted-foreground'>
                    <span className='flex items-center gap-2'>
                        <InfoIcon className='size-5'/>
                        <span>Additional product information</span>
                    </span>
                    <Accordion type='multiple'>
                        {product.additionalInfoSections.map(section=>(
                            <AccordionItem value={section.title || ""} key={section.title}>
                                <AccordionTrigger>{section.title}</AccordionTrigger>
                                <AccordionContent>
                                    <div dangerouslySetInnerHTML={{__html: section.description || ""}}
                                        className='prose text-sm text-muted-foreground dark:prose-invert'
                                    />
                                </AccordionContent>
                            </AccordionItem>
                        ))}

                    </Accordion>
                    


                </div>
            )}
        </div>
      
    </div>
  );
}

export default ProductDetails;
