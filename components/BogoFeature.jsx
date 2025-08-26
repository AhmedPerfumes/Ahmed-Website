import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useContextElement } from '@/context/Context';

const BOGOFeature = () => {
  const { cartProducts, addProductToCart, removeGiftFromCart } = useContextElement();
  const [addedGifts, setAddedGifts] = useState([]);
  const [selectedGifts, setSelectedGifts] = useState({});
  const prevCartRef = useRef([]);
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch promotion rules
  useEffect(() => {
    const fetchBogoRules = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/bogoProducts`);
        if (!response.ok) throw new Error('Failed to fetch bogoProducts');
        const data = await response.json();
        console.log('000 API Response:', JSON.stringify(data, null, 2));
        const validPromotions = (data.bogoProducts || []).filter(
          (promo) => promo.campaign && promo.buy_products
        ).map(promo => ({
          ...promo,
          free_products: promo.free_products && promo.free_products.length > 0 
            ? promo.free_products 
            : promo.buy_products
        }));
        setPromotions(validPromotions);
      } catch (error) {
        console.error('Error fetching bogoProducts:', error);
        setPromotions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBogoRules();
  }, []);

  // Handle cart changes and gift logic
  useEffect(() => {
    if (loading) return;

    const prevCart = prevCartRef.current;

    // Deep comparison to check if cart has changed
    const hasCartChanged = () => {
      if (prevCart.length !== cartProducts.length) return true;
      return cartProducts.some((item, i) => {
        return (
          item.product_id !== prevCart[i]?.product_id ||
          item.quantity !== prevCart[i]?.quantity ||
          item.is_gift !== prevCart[i]?.is_gift
        );
      });
    };

    if (!hasCartChanged()) {
      console.log('000 Cart unchanged, skipping gift logic');
      return;
    }

    console.log('000 Processing gifts for cart:', JSON.stringify(cartProducts, null, 2));

    const newGiftsToAdd = [];

    promotions.forEach((promo) => {
      const { buy_quantity, get_quantity, selection_rule, buy_products, free_products, campaign, name } = promo;

      if (!campaign) {
        console.warn(`000 Skipping promotion with undefined campaign:`, promo);
        return;
      }

      console.log(`000 Processing campaign ${campaign}:`);

      // Filter eligible products
      const eligibleProducts = cartProducts.filter(
        (item) =>
          item.discount === null &&
          !item.is_gift &&
          buy_products.some((b) => b.product_id === item.product_id)
      );

      console.log(`000 Eligible products:`, JSON.stringify(eligibleProducts, null, 2));

      // Calculate gift eligibility
      const totalQuantity = eligibleProducts.reduce((sum, item) => sum + (item.quantity || 0), 0);
      const giftSets = Math.floor(totalQuantity / buy_quantity);
      const giftsAllowed = giftSets * get_quantity;

      console.log(`000 Total quantity: ${totalQuantity}, Gift sets: ${giftSets}, Gifts allowed: ${giftsAllowed}`);

      // Current gifts in cart for this campaign
      const currentGifts = cartProducts.filter(
        (p) => p.is_gift && p.campaign === campaign
      );
      console.log(`111 `, currentGifts);
      const currentGiftQuantity = currentGifts.reduce((sum, g) => sum + (g.quantity || 0), 0);
      console.log(`111 Current gifts:`, JSON.stringify(currentGifts, null, 2), `Current gift quantity: ${currentGiftQuantity}`);

      // Handle gift removal and addition
      if (selection_rule === 'least_expensive') {
        // Remove all gifts if giftsAllowed is 0
        if (giftsAllowed === 0) {
          currentGifts.forEach((gift) => {
            console.log(`000 Removing gift for campaign ${campaign} due to insufficient quantity:`, gift.product_id);
            removeGiftFromCart(gift.product_id, campaign);
          });
          return;
        }

        // Remove invalid or excess gifts
        currentGifts.forEach((gift) => {
          const isValidGift = free_products.some((fp) => fp.product_id === gift.product_id);
          if (!isValidGift || currentGiftQuantity > giftsAllowed) {
            console.log(`000 Removing invalid/excess gift for campaign ${campaign}:`, gift.product_id);
            removeGiftFromCart(gift.product_id, campaign);
          } else {
            newGiftsToAdd.push({
              product_id: gift.product_id,
              quantity: gift.quantity,
              campaign,
            });
          }
        });

        // Filter candidate gifts
        const purchasedProductIds = eligibleProducts.map((p) => p.product_id);
        const candidateGifts = free_products.filter((fp) =>
          purchasedProductIds.includes(fp.product_id)
        );
        console.log(`000 Candidate gifts:`, JSON.stringify(candidateGifts, null, 2));

        if (candidateGifts.length === 0) {
          console.log(`000 No candidate gifts for campaign ${campaign}`);
          return;
        }

        let remainingGifts = giftsAllowed - newGiftsToAdd
          .filter((g) => g.campaign === campaign)
          .reduce((sum, g) => sum + (g.quantity || 0), 0);
        console.log(`000 Remaining gifts: ${remainingGifts}`);

        if (remainingGifts <= 0) return;

        // Check if all candidate gifts have the same price
        const prices = candidateGifts.map((gift) => Number(gift.price) || 0);
        const allPricesEqual = candidateGifts.length > 1 && new Set(prices).size === 1;
        console.log(`000 All prices equal: ${allPricesEqual}, Prices:`, prices);

        if (allPricesEqual && candidateGifts.length > 1) {
          // Case 3: Multiple products with same price, user selects
          const selected = selectedGifts[campaign] || [];
          console.log(`000 Selected gifts for ${campaign}:`, JSON.stringify(selected, null, 2));
          let totalSelected = selected.reduce((sum, gift) => sum + (gift.quantity || 0), 0);
          if (totalSelected > giftsAllowed) {
            console.log(`000 Warning: Total selected gifts (${totalSelected}) exceeds giftsAllowed (${giftsAllowed})`);
            return;
          }
          selected.forEach((gift) => {
            if (remainingGifts <= 0) return;
            const bogoGift = candidateGifts.find((fp) => fp.product_id === gift.product_id);
            if (bogoGift) {
              const purchasedProduct = eligibleProducts.find((p) => p.product_id === bogoGift.product_id);
              const giftQuantity = Math.min(
                gift.quantity || 0,
                remainingGifts,
                purchasedProduct?.quantity || 0
              );
              if (giftQuantity > 0) {
                console.log(`000 Adding selected gift for ${campaign}:`, {
                  product_id: bogoGift.product_id,
                  quantity: giftQuantity,
                });
                addProductToCart({
                  ...bogoGift,
                  is_gift: true,
                  price: '0',
                  quantity: giftQuantity,
                  campaign,
                  selection_rule: 'least_expensive',
                });
                newGiftsToAdd.push({
                  product_id: bogoGift.product_id,
                  quantity: giftQuantity,
                  campaign,
                });
                remainingGifts -= giftQuantity;
              }
            }
          });
        } else if (new Set(purchasedProductIds).size === 1) {
          // Case 1: Single product type
          const bogoGift = candidateGifts[0];
          const purchasedProduct = eligibleProducts.find((p) => p.product_id === bogoGift.product_id);
          if (purchasedProduct) {
            const giftQuantity = Math.min(get_quantity, remainingGifts, purchasedProduct.quantity);
            if (giftQuantity > 0 && !currentGifts.some((g) => g.product_id === bogoGift.product_id)) {
              console.log(`000 Adding gift for ${campaign}:`, {
                product_id: bogoGift.product_id,
                quantity: giftQuantity,
              });
              addProductToCart({
                ...bogoGift,
                is_gift: true,
                price: '0',
                quantity: giftQuantity,
                campaign,
                selection_rule: 'least_expensive',
              });
              newGiftsToAdd.push({
                product_id: bogoGift.product_id,
                quantity: giftQuantity,
                campaign,
              });
              remainingGifts -= giftQuantity;
            }
          }
        } else {
          // Case 2: Multiple products with different prices
          const sortedProducts = [...candidateGifts].sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
          console.log(`000 Sorted products:`, JSON.stringify(sortedProducts, null, 2));
          // sortedProducts.some((bogoGift) => {
          //   if (remainingGifts <= 0) return true;
          //   const purchasedProduct = eligibleProducts.find((p) => p.product_id === bogoGift.product_id);
          //   if (!purchasedProduct) return false;
          //   const giftQuantity = Math.min(get_quantity, remainingGifts, purchasedProduct.quantity);
          //   if (giftQuantity > 0 && !currentGifts.some((g) => g.product_id === bogoGift.product_id)) {
          //     console.log(`000 Adding gift for ${campaign}:`, {
          //       product_id: bogoGift.product_id,
          //       quantity: giftQuantity,
          //     });
          //     addProductToCart({
          //       ...bogoGift,
          //       is_gift: true,
          //       price: '0',
          //       quantity: giftQuantity,
          //       campaign,
          //       selection_rule: 'least_expensive',
          //     });
          //     newGiftsToAdd.push({
          //       product_id: bogoGift.product_id,
          //       quantity: giftQuantity,
          //       campaign,
          //     });
          //     remainingGifts -= giftQuantity;
          //   }
          //   return remainingGifts <= 0;
          // });
          // Only use the cheapest product
          // Case 2: Multiple products with different prices
          // Only use the cheapest product
          // Case 2: Multiple products with different prices
          // Only use the cheapest product
          const bogoGift = sortedProducts[0]; // Cheapest product
          const purchasedProduct = eligibleProducts.find((p) => p.product_id === bogoGift.product_id);
          console.log(`000 Purchased product:`, purchasedProduct);
          if (purchasedProduct) {
            // const giftQuantity = Math.min(get_quantity * giftSets, remainingGifts, purchasedProduct.quantity);
            const giftQuantity = get_quantity;
            console.log(`000 Gift quantity:`, giftQuantity);
            // Check if a gift for this product and campaign already exists
            const giftExists = newGiftsToAdd.some(
              (g) => g.product_id === bogoGift.product_id && g.campaign === campaign
            ) || currentGifts.some(
              (g) => g.product_id === bogoGift.product_id && g.campaign === campaign
            );
            if (giftQuantity > 0 && !giftExists) {
              console.log(`000 Adding gift for ${campaign} (cheapest product):`, {
                product_id: bogoGift.product_id,
                quantity: giftQuantity,
              });
              addProductToCart({
                ...bogoGift,
                is_gift: true,
                price: '0',
                quantity: giftQuantity,
                campaign,
                selection_rule: 'least_expensive',
              });
              newGiftsToAdd.push({
                product_id: bogoGift.product_id,
                quantity: giftQuantity,
                campaign,
              });
              remainingGifts -= giftQuantity;
            } else {
              console.log(`000 Skipping gift: gift already exists or quantity is 0`, { giftExists, giftQuantity });
            }
          }
        }
      } else if (selection_rule === 'auto_add') {
        if (giftsAllowed === 0) {
          currentGifts.forEach((gift) => {
            console.log(`000 Removing gift for campaign ${campaign} due to insufficient quantity:`, gift.product_id);
            removeGiftFromCart(gift.product_id, campaign);
          });
          return;
        }
        currentGifts.forEach((gift) => {
          const isValidGift = free_products.some((fp) => fp.product_id === gift.product_id);
          if (!isValidGift || currentGiftQuantity > giftsAllowed) {
            console.log(`000 Removing gift for campaign ${campaign}:`, gift.product_id);
            removeGiftFromCart(gift.product_id, campaign);
          } else {
            newGiftsToAdd.push({
              product_id: gift.product_id,
              quantity: gift.quantity,
              campaign,
            });
          }
        });
        let remainingGifts = giftsAllowed - newGiftsToAdd
          .filter((g) => g.campaign === campaign)
          .reduce((sum, g) => sum + (g.quantity || 0), 0);
        if (remainingGifts <= 0) return;
        const availableGifts = free_products.filter(
          (fp) => !currentGifts.some((g) => g.product_id === fp.product_id)
        );
        availableGifts.some((bogoGift) => {
          if (remainingGifts <= 0) return true;
          const giftQuantity = Math.min(get_quantity, remainingGifts);
          console.log(`000 Adding gift for ${campaign}:`, { product_id: bogoGift.product_id, quantity: giftQuantity });
          addProductToCart({
            ...bogoGift,
            is_gift: true,
            price: '0',
            quantity: giftQuantity,
            campaign,
            selection_rule: 'auto_add',
          });
          newGiftsToAdd.push({
            product_id: bogoGift.product_id,
            quantity: giftQuantity,
            campaign,
          });
          remainingGifts -= giftQuantity;
          return remainingGifts <= 0;
        });
      } else if (selection_rule === 'same_product') {
        currentGifts.forEach((gift) => {
          const matchingProduct = eligibleProducts.find((p) => p.product_id === gift.product_id);
          const isValidGift = free_products.some((fp) => fp.product_id === gift.product_id);
          if (!isValidGift || (matchingProduct && matchingProduct.quantity < gift.quantity) || currentGiftQuantity > giftsAllowed) {
            console.log(`000 Removing gift for campaign ${campaign}:`, gift.product_id);
            removeGiftFromCart(gift.product_id, campaign);
          } else {
            newGiftsToAdd.push({
              product_id: gift.product_id,
              quantity: gift.quantity,
              campaign,
            });
          }
        });
        eligibleProducts.forEach((product) => {
          const giftExists = currentGifts.find((g) => g.product_id === product.product_id);
          if (!giftExists && giftsAllowed > currentGiftQuantity) {
            const bogoGift = free_products.find((fp) => fp.product_id === product.product_id);
            if (bogoGift) {
              const giftQuantity = product.quantity;
              console.log(`111 Adding gift for ${campaign}:`, { product_id: bogoGift.product_id, quantity: giftQuantity });
              addProductToCart({
                ...bogoGift,
                is_gift: true,
                price: '0',
                quantity: giftQuantity,
                campaign,
                selection_rule: 'same_product',
              });
              newGiftsToAdd.push({
                product_id: bogoGift.product_id,
                quantity: giftQuantity,
                campaign,
              });
            }
          } else if (giftExists) {
            newGiftsToAdd.push({
              product_id: product.product_id,
              quantity: giftExists.quantity,
              campaign,
            });
          }
        });
      } else if (selection_rule === 'customer_select') {
        currentGifts.forEach((gift) => {
          const matchingProduct = eligibleProducts.find((p) => p.product_id === gift.product_id);
          const isValidGift = free_products.some((fp) => fp.product_id === gift.product_id);
          if (!isValidGift || (matchingProduct && matchingProduct.quantity < gift.quantity) || currentGiftQuantity > giftsAllowed) {
            console.log(`000 Removing gift for campaign ${campaign}:`, gift.product_id);
            removeGiftFromCart(gift.product_id, campaign);
          } else {
            newGiftsToAdd.push({
              product_id: gift.product_id,
              quantity: gift.quantity,
              campaign,
            });
          }
        });
        const selected = selectedGifts[campaign] || [];
        let remainingGifts = giftsAllowed - newGiftsToAdd
          .filter((g) => g.campaign === campaign)
          .reduce((sum, g) => sum + (g.quantity || 0), 0);
        if (remainingGifts <= 0) return;
        selected.forEach((gift) => {
          if (remainingGifts <= 0) return;
          const bogoGift = free_products.find((fp) => fp.product_id === gift.product_id);
          if (bogoGift) {
            const purchasedProduct = eligibleProducts.find((p) => p.product_id === bogoGift.product_id);
            const giftQuantity = Math.min(gift.quantity || 0, remainingGifts, purchasedProduct?.quantity || 0);
            if (giftQuantity > 0) {
              console.log(`000 Adding selected gift for ${campaign}:`, { product_id: bogoGift.product_id, quantity: giftQuantity });
              addProductToCart({
                ...bogoGift,
                is_gift: true,
                price: '0',
                quantity: giftQuantity,
                campaign,
                selection_rule: 'customer_select',
              });
              newGiftsToAdd.push({
                product_id: bogoGift.product_id,
                quantity: giftQuantity,
                campaign,
              });
              remainingGifts -= giftQuantity;
            }
          }
        });
      }
    });

    console.log('000 New gifts to add:', JSON.stringify(newGiftsToAdd, null, 2));

    // Update state if gifts have changed
    if (JSON.stringify(newGiftsToAdd) !== JSON.stringify(addedGifts)) {
      setAddedGifts(newGiftsToAdd);
      prevCartRef.current = cartProducts.map((p) => ({
        product_id: p.product_id,
        quantity: p.quantity || 0,
        is_gift: p.is_gift || false,
      }));
    }
  }, [cartProducts, promotions, loading, selectedGifts]);

  // Handle customer gift selection
  const handleGiftSelection = (campaign, productId, quantity) => {
    const parsedQuantity = Math.max(0, parseInt(quantity) || 0);
    console.log(`000 Handling gift selection for ${campaign}: product_id=${productId}, quantity=${parsedQuantity}`);
    setSelectedGifts((prev) => ({
      ...prev,
      [campaign]: [
        ...(prev[campaign] || []).filter((g) => g.product_id !== productId),
        { product_id: productId, quantity: parsedQuantity },
      ].filter((g) => g.quantity > 0),
    }));
  };

  if (loading) return null;

  // Group gifts by campaign for display
  const giftsByCampaign = addedGifts.reduce((acc, gift) => {
    if (!gift.campaign) return acc;
    acc[gift.campaign] = acc[gift.campaign] || [];
    const match = promotions
      .flatMap((p) => p.free_products)
      .find((fp) => fp.product_id === gift.product_id);
    if (match) {
      acc[gift.campaign].push({ ...match, quantity: gift.quantity });
    }
    return acc;
  }, {});
  console.log('000 Gifts by campaign:', JSON.stringify(giftsByCampaign, null, 2));

  return (
    <div className="my-4 px-4">
      {promotions.map((promo) => {
        const { campaign, name, selection_rule, free_products, buy_quantity, get_quantity } = promo;
        if (!campaign) {
          console.warn('Skipping rendering for undefined campaign:', promo);
          return null;
        }

        const gifts = giftsByCampaign[campaign] || [];
        const eligibleProducts = cartProducts.filter(
          (item) =>
            item.discount === null &&
            !item.is_gift &&
            promo.buy_products.some((b) => b.product_id === item.product_id)
        );
        const totalQuantity = eligibleProducts.reduce((sum, item) => sum + (item.quantity || 0), 0);
        const giftSets = Math.floor(totalQuantity / buy_quantity);
        const giftsAllowed = giftSets * get_quantity;
        console.log(`000 Rendering campaign ${campaign}: giftsAllowed=${giftsAllowed}, gifts=`, JSON.stringify(gifts, null, 2));

        // Check for equal prices
        const purchasedProductIds = eligibleProducts.map((p) => p.product_id);
        if (giftsAllowed > 0) {
          const candidateGifts = free_products.filter((fp) =>
            purchasedProductIds.includes(fp.product_id)
          );
        }
        const candidateGifts = free_products;
        const prices = candidateGifts.map((gift) => Number(gift.price) || 0);
        const allPricesEqual = candidateGifts.length > 1 && new Set(prices).size === 1;
        console.log('111', selection_rule, allPricesEqual, giftsAllowed, candidateGifts)
        if ((selection_rule === 'customer_select' || (selection_rule === 'least_expensive' && allPricesEqual)) && giftsAllowed > 0) {
          console.log(`000 Rendering selection UI for ${campaign}`);
          return (
            <div key={campaign} className="mb-6">
              <h4 className="font-bold mb-4">
                <span
                  className="t-subtitle"
                  style={{
                    color: '#000000',
                    fontSize: '18px',
                    lineHeight: '1.5rem',
                    textAlign: 'center',
                  }}
                >
                  Select your free gifts for {name} (Choose {giftsAllowed} items)
                </span>
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {candidateGifts.map((product) => (
                  <div key={product.product_id} className="flex items-center p-2 border">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_URL}storage/${product.image}`}
                      alt={product.product_name}
                      width={50}
                      height={50}
                    />
                    <div className="ml-4">
                      <p>{product.product_name}</p>
                      <input
                        type="number"
                        min="0"
                        max={giftsAllowed}
                        value={
                          (selectedGifts[campaign]?.find((g) => g.product_id === product.product_id)?.quantity) || 0
                        }
                        onChange={(e) =>
                          handleGiftSelection(campaign, product.product_id, parseInt(e.target.value))
                        }
                        className="w-16 p-1 border"
                        disabled={giftsAllowed <= 0}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        } else if (gifts.length > 0) {
          console.log(`000 Rendering gift display for ${campaign}`);
          return (
            <div key={campaign} className="mb-6">
              <h4 className="font-bold mb-4">
                <span
                  className="t-subtitle"
                  style={{
                    color: '#000000',
                    fontSize: '18px',
                    lineHeight: '1.5rem',
                    textAlign: 'center',
                  }}
                >
                  Your {name} offer has been applied to the cart!
                </span>
              </h4>
              {/* <div className="grid grid-cols-2 gap-4">
                {gifts.map((gift) => (
                  <div key={gift.product_id} className="flex items-center p-2">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_URL}storage/${gift.image}`}
                      alt={gift.product_name}
                      width={50}
                      height={50}
                    />
                    <span className="ml-4">
                      {gift.product_name} (x{gift.quantity}) - Free
                    </span>
                  </div>
                ))}
              </div> */}
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};

export default BOGOFeature;