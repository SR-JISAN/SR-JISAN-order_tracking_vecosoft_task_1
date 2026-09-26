"use client";

import * as React from "react";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Clock3,
  Headphones,
  ChevronDown,
  Package,
  PackageCheck,
  PackageOpen,
  RefreshCw,
  Search,
  ShieldAlert,
  Truck,
  XCircle,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";


type Scenario = "delayed" | "delivered-not-received" | "tracking-unavailable";

type OrderStatus = "PROCESSING" | "SHIPPED" | "OUT_FOR_DELIVERY" | "DELIVERED";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

interface Order {
  id: string;
  status: OrderStatus;
  estimatedDelivery: string;
  estimatedDeliveryTime?: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  trackingNumber?: string;
}

interface ScenarioConfig {
  label: string;
  order: Order;
}


const baseItems: OrderItem[] = [
  {
    id: "item-1",
    name: "Wireless Noise Cancelling Headphones",
    quantity: 1,
    price: 7490,
  },
  {
    id: "item-2",
    name: "USB-C Fast Charging Cable",
    quantity: 2,
    price: 890,
  },
];

const scenarioData: Record<Scenario, ScenarioConfig> = {
  delayed: {
    label: "Delayed Order",
    order: {
      id: "ORD-2026-00982",
      status: "SHIPPED",
      estimatedDelivery: "September 25, 2026",
      estimatedDeliveryTime: "6:00 PM",
      trackingNumber: "TRK-92837465",
      items: baseItems,
      subtotal: 9270,
      shipping: 120,
      total: 9390,
    },
  },

  "delivered-not-received": {
    label: "Delivered but Not Received",
    order: {
      id: "ORD-2026-00981",
      status: "DELIVERED",
      estimatedDelivery: "September 26, 2026",
      estimatedDeliveryTime: "3:40 PM",
      trackingNumber: "TRK-92837412",
      items: baseItems,
      subtotal: 9270,
      shipping: 120,
      total: 9390,
    },
  },

  "tracking-unavailable": {
    label: "Tracking Not Available",
    order: {
      id: "ORD-2026-00980",
      status: "PROCESSING",
      estimatedDelivery: "September 29, 2026",
      estimatedDeliveryTime: "8:00 PM",
      items: baseItems,
      subtotal: 9270,
      shipping: 120,
      total: 9390,
    },
  },
};


const timelineSteps = [
  {
    status: "PROCESSING" as const,
    title: "Processing",
    description: "Your order has been confirmed",
    icon: PackageOpen,
  },
  {
    status: "SHIPPED" as const,
    title: "Shipped",
    description: "Your package is on the way",
    icon: Truck,
  },
  {
    status: "OUT_FOR_DELIVERY" as const,
    title: "Out for Delivery",
    description: "Courier is heading to you",
    icon: PackageCheck,
  },
  {
    status: "DELIVERED" as const,
    title: "Delivered",
    description: "Package delivered successfully",
    icon: CheckCircle2,
  },
];

const statusOrder: OrderStatus[] = [
  "PROCESSING",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];


function getStatusIndex(status: OrderStatus) {
  return statusOrder.indexOf(status);
}

function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(amount);
}

function getStatusLabel(status: OrderStatus) {
  switch (status) {
    case "PROCESSING":
      return "Processing";
    case "SHIPPED":
      return "Shipped";
    case "OUT_FOR_DELIVERY":
      return "Out for Delivery";
    case "DELIVERED":
      return "Delivered";
  }
}


interface OrderTimelineProps {
  status: OrderStatus;
}

function OrderTimeline({ status }: OrderTimelineProps) {
  const currentIndex = getStatusIndex(status);

  return (
    <div className="mt-6">
      {timelineSteps.map((step, index) => {
        const Icon = step.icon;
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <div key={step.status} className="relative flex gap-3">
            {/* Vertical line */}
            {index !== timelineSteps.length - 1 && (
              <div
                className={[
                  "absolute left-4.25 top-9 h-[calc(100%-8px)] w-0.5",
                  index < currentIndex
                    ? "bg-emerald-500"
                    : "bg-muted-foreground/20",
                ].join(" ")}
              />
            )}

            {/* Icon */}
            <div
              className={[
                "relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border",
                isCompleted || isCurrent
                  ? "border-emerald-500 bg-emerald-500 text-white"
                  : "border-muted-foreground/20 bg-muted text-muted-foreground",
              ].join(" ")}
            >
              {isCompleted ? (
                <Check className="h-4 w-4" />
              ) : (
                <Icon className="h-4 w-4" />
              )}
            </div>

            {/* Content */}
            <div className="min-w-0 pb-7">
              <p
                className={[
                  "text-sm font-semibold",
                  isCurrent
                    ? "text-foreground"
                    : isCompleted
                      ? "text-foreground"
                      : "text-muted-foreground",
                ].join(" ")}
              >
                {step.title}
                {isCurrent && (
                  <Badge
                    variant="secondary"
                    className="ml-2 px-2 py-0 text-[10px]"
                  >
                    Current
                  </Badge>
                )}
              </p>

              <p className="mt-0.5 text-xs text-muted-foreground">
                {step.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}


function OrderSummary({ order }: { order: Order }) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between py-3 text-left"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
            <Package className="h-4 w-4" />
          </div>

          <div>
            <p className="text-sm font-semibold">Order summary</p>

            <p className="text-xs text-muted-foreground">
              {order.items.length} products · {formatPrice(order.total)}
            </p>
          </div>
        </div>

        <ChevronDown
          className={[
            "h-4 w-4 text-muted-foreground transition-transform duration-200",
            isOpen ? "rotate-180" : "",
          ].join(" ")}
        />
      </button>

      {isOpen && (
        <div className="pb-3">
          <div className="space-y-4">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between gap-3"
              >
                <div className="flex min-w-0 gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </div>

                  <div className="min-w-0">
                    <p className="line-clamp-2 text-sm font-medium">
                      {item.name}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Qty: {item.quantity}
                    </p>
                  </div>
                </div>

                <p className="shrink-0 text-sm font-medium">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            ))}

            <Separator />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>

              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span>{formatPrice(order.shipping)}</span>
              </div>

              <div className="flex justify-between pt-1 font-semibold">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


function DelayedOrderAlert({ order }: { order: Order }) {
  return (
    <Alert className="border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-100">
      <Clock3 className="h-4 w-4" />

      <AlertTitle>Delivery is taking longer than expected</AlertTitle>

      <AlertDescription className="mt-1 text-xs leading-5">
        Your estimated delivery date was {order.estimatedDelivery}. We&apos;re
        sorry for the delay. You can contact support for the latest update.
      </AlertDescription>

      <Button
        size="sm"
        variant="outline"
        className="mt-3 h-8 border-amber-300 bg-transparent text-xs hover:bg-amber-100"
      >
        <Headphones className="mr-1.5 h-3.5 w-3.5" />
        Contact Support
      </Button>
    </Alert>
  );
}


function DeliveredNotReceivedAlert() {
  return (
    <Alert className="border-red-200 bg-red-50 text-red-950 dark:border-red-900 dark:bg-red-950/30 dark:text-red-100">
      <ShieldAlert className="h-4 w-4" />

      <AlertTitle>Package marked as delivered</AlertTitle>

      <AlertDescription className="mt-1 text-xs leading-5">
        Our system shows that this order was delivered, but you reported that
        you haven&apos;t received it.
      </AlertDescription>

      <Button size="sm" variant="destructive" className="mt-3 h-8 text-xs">
        <ShieldAlert className="mr-1.5 h-3.5 w-3.5" />
        Dispute Delivery
      </Button>
    </Alert>
  );
}


function TrackingUnavailable() {
  return (
    <div className="rounded-xl border border-dashed bg-muted/30 px-5 py-8 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
        <PackageOpen className="h-7 w-7 text-primary" />
      </div>

      <h3 className="mt-4 text-sm font-semibold">
        Your package is being prepared
      </h3>

      <p className="mx-auto mt-1.5 max-w-72.5 text-xs leading-5 text-muted-foreground">
        Tracking will become available as soon as your package leaves our
        warehouse. You don&apos;t need to do anything right now.
      </p>

      <Button variant="outline" size="sm" className="mt-4 h-8 text-xs">
        <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
        Check Again
      </Button>
    </div>
  );
}


export default function OrderTrackingPage() {
  const [scenario, setScenario] = React.useState<Scenario>("delayed");

  const { order } = scenarioData[scenario];

  const isDelayed = scenario === "delayed";
  const isDeliveredNotReceived = scenario === "delivered-not-received";
  const isTrackingUnavailable = scenario === "tracking-unavailable";

  return (
    <main className="min-h-screen bg-muted/40 px-3 py-4 sm:px-6 sm:py-8">

      <div className="mx-auto mb-4 w-full max-w-105">
        <div className="rounded-xl p-5 bg-background  shadow-sm">
          <div className="mb-2 px-1">
            <p className="text-2xl font-semibold uppercase tracking-wider text-muted-foreground">
              Testing Panel
            </p>
            <p className="text-xs text-muted-foreground">
              Switch scenarios to test edge cases
            </p>
          </div>

          <Tabs
            value={scenario}
            onValueChange={(value) => setScenario(value as Scenario)}
          >
            <TabsList className="grid h-auto w-full grid-cols-3 gap-1 bg-muted p-1">
              <TabsTrigger
                value="delayed"
                className="h-auto min-h-9 px-1.5 py-1.5 text-[10px] leading-tight"
              >
                Delayed
              </TabsTrigger>

              <TabsTrigger
                value="delivered-not-received"
                className="h-auto min-h-9 px-1.5 py-1.5 text-[10px] leading-tight"
              >
                Not Received
              </TabsTrigger>

              <TabsTrigger
                value="tracking-unavailable"
                className="h-auto min-h-9 px-1.5 py-1.5 text-[10px] leading-tight"
              >
                No Tracking
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <Card className="mx-auto w-full max-w-105overflow-hidden  shadow-lg">
        <CardHeader className="space-y-0 px-4 pb-3 pt-4 sm:px-5">
          {/* Top row */}
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs text-muted-foreground">Order</p>
              <h1 className="text-base font-bold tracking-tight">
                #{order.id}
              </h1>
            </div>

            <Badge
              variant={order.status === "DELIVERED" ? "default" : "secondary"}
              className="shrink-0 text-[10px]"
            >
              {getStatusLabel(order.status)}
            </Badge>
          </div>

          {/* Delivery estimate */}
          <div className="mt-4 rounded-xl bg-muted/60 p-3">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-background">
                <Truck className="h-4 w-4" />
              </div>

              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">
                  Estimated delivery
                </p>

                <p className="mt-0.5 text-sm font-semibold">
                  {order.estimatedDelivery}
                </p>

                {order.estimatedDeliveryTime && (
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    By {order.estimatedDeliveryTime}
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-5 px-4 pb-5 sm:px-5">
          {/* Scenario-specific alerts */}
          {isDelayed && <DelayedOrderAlert order={order} />}

          {isDeliveredNotReceived && <DeliveredNotReceivedAlert />}

          {/* Tracking unavailable */}
          {isTrackingUnavailable ? (
            <TrackingUnavailable />
          ) : (
            <>
              {/* Timeline */}
              <section>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-semibold">Delivery progress</h2>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Follow your package every step of the way
                    </p>
                  </div>

                  <Package className="h-4 w-4 text-muted-foreground" />
                </div>

                <OrderTimeline status={order.status} />
              </section>

              {/* Delivered but not received extra action */}
              {isDeliveredNotReceived && (
                <div className="rounded-xl border border-red-200 bg-red-50/60 p-3 dark:border-red-900 dark:bg-red-950/20">
                  <div className="flex gap-3">
                    <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />

                    <div>
                      <p className="text-xs font-semibold">
                        Didn&apos;t receive this package?
                      </p>

                      <p className="mt-1 text-[11px] leading-4 text-muted-foreground">
                        Check around your delivery location first. If the
                        package is still missing, report the issue to our
                        support team.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tracking number */}
              {order.trackingNumber && (
                <div className="flex items-center justify-between rounded-lg border px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-muted-foreground" />

                    <div>
                      <p className="text-[10px] text-muted-foreground">
                        Tracking number
                      </p>
                      <p className="font-mono text-xs font-medium">
                        {order.trackingNumber}
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs"
                  >
                    Track
                  </Button>
                </div>
              )}
            </>
          )}

          {/* Order summary */}
          <div className="rounded-xl border px-3">
            <OrderSummary order={order} />
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" className="h-10 text-xs">
              <Headphones className="mr-1.5 h-4 w-4" />
              Contact Support
            </Button>

            <Button variant="outline" className="h-10 text-xs">
              <AlertCircle className="mr-1.5 h-4 w-4" />
              Report Issue
            </Button>
          </div>

          {/* Bottom status */}
          <div className="flex items-center justify-center gap-1.5 pt-1 text-[10px] text-muted-foreground">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Secure order tracking
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
